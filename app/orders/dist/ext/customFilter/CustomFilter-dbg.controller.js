sap.ui.define(
  [
    'sap/ui/core/mvc/ControllerExtension',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/SuggestionItem',
    'sap/m/MessageToast'
  ],
  function (
    ControllerExtension,
    Fragment,
    Filter,
    FilterOperator,
    SuggestionItem,
    MessageToast
  ) {
    'use strict'

    return ControllerExtension.extend(
      'ns.orders.ext.customFilter.CustomFilterPanel',
      {
        override: {
          onInit: function () {
            this._oFilterPanel = null
            this._sCustomerID = null
            this._oDateFrom = null
            this._oDateTo = null
            this._nAmountFrom = null
            this._nAmountTo = null
            this._aStatuses = []
          },

          onAfterRendering: function () {
            if (this._oFilterPanel) return
            this._injectFilterPanel()
          }
        },

        // injecting the fragment
        _fragmentId: function () {
          return this.base.getView().getId() + '--customFilter'
        },

        _byFragId: function (sControlId) {
          return Fragment.byId(this._fragmentId(), sControlId)
        },

        _injectFilterPanel: function () {
          var oView = this.base.getView()

          Fragment.load({
            id: this._fragmentId(),
            name: 'ns.orders.ext.customFilter.CustomFilterPanel',
            controller: this
          })
            .then(
              function (oFragment) {
                this._oFilterPanel = oFragment

                var oPage = this._findDynamicPage(oView)
                if (oPage) {
                  var oHeader = oPage.getHeader()
                  if (oHeader && oHeader.addContent) {
                    oHeader.addContent(oFragment)
                    return
                  }
                }

                var oRoot = oView.getContent()[0]
                if (oRoot && oRoot.insertItem) {
                  oRoot.insertItem(oFragment, 0)
                  return
                }
                if (oRoot && oRoot.insertContent) {
                  oRoot.insertContent(oFragment, 0)
                  return
                }
                oView.addContent(oFragment)
              }.bind(this)
            )
            .catch(function (oErr) {
              console.error('CustomFilterPanel: fragment load failed', oErr)
            })
        },

        _findDynamicPage: function (oControl) {
          if (!oControl) return null
          if (oControl.isA && oControl.isA('sap.f.DynamicPage')) return oControl
          var aChildren = [].concat(
            (oControl.getContent && oControl.getContent()) || [],
            (oControl.getItems && oControl.getItems()) || [],
            (oControl.getSections && oControl.getSections()) || []
          )
          for (var i = 0; i < aChildren.length; i++) {
            var oFound = this._findDynamicPage(aChildren[i])
            if (oFound) return oFound
          }
          return null
        },

        // customer filter
        onCustomerSuggest: function (oEvent) {
          var sQuery = oEvent.getParameter('suggestValue')
          var oInput = oEvent.getSource()

          if (!sQuery || sQuery.length < 2) return

          var sQueryLower = sQuery.toLowerCase()
          var oModel = this.base.getView().getModel()

          // Query the Users entity directly for name suggestions
          oModel
            .bindList(
              '/User',
              null,
              null,
              [new Filter('names', FilterOperator.Contains, sQuery)],
              { $select: 'ID,names' }
            )
            .requestContexts(0, 10)
            .then(function (aContexts) {
              oInput.destroySuggestionItems()
              aContexts
                .filter(function (oCtx) {
                  var sName = oCtx.getObject().names || ''
                  return sName.toLowerCase().includes(sQueryLower)
                })
                .forEach(function (oCtx) {
                  var o = oCtx.getObject()
                  oInput.addSuggestionItem(
                    new SuggestionItem({
                      key: o.ID,
                      text: o.names
                    })
                  )
                })
            })
            .catch(function (e) {
              console.error('Customer suggest error:', e)
            })
        },

        onCustomerSuggestionSelected: function (oEvent) {
          var oItem = oEvent.getParameter('selectedItem')
          this._sCustomerID = oItem ? oItem.getKey() : null
        },

        onCustomerLiveChange: function (oEvent) {
          if (!oEvent.getParameter('value')) {
            this._sCustomerID = null
          }
        },

        // date range filter
        onDateRangeChange: function (oEvent) {
          var oDateRS = oEvent.getSource()
          var oFrom = oDateRS.getDateValue()
          var oTo = oDateRS.getSecondDateValue()

          if (oFrom) {
            var dFrom = new Date(oFrom)
            dFrom.setHours(0, 0, 0, 0)
            this._oDateFrom = dFrom.toISOString()
          } else {
            this._oDateFrom = null
          }

          if (oTo) {
            var dTo = new Date(oTo)
            dTo.setHours(23, 59, 59, 999)
            this._oDateTo = dTo.toISOString()
          } else {
            this._oDateTo = null
          }
        },

        // amount filter
        onAmountChange: function () {
          var oFrom = this._byFragId('amountFrom')
          var oTo = this._byFragId('amountTo')
          this._nAmountFrom = oFrom ? oFrom.getValue() : null
          this._nAmountTo = oTo ? oTo.getValue() : null
        },

        // status filter
        onStatusChange: function (oEvent) {
          this._aStatuses = oEvent.getSource().getSelectedKeys()
        },

        // applying all filters
        onApplyFilters: function () {
          this._applyToTable(this._buildFilters())
        },

        onResetFilters: function () {
          this._byFragId('customerInput').setValue('')
          this._byFragId('orderDateRange').setValue('')
          this._byFragId('amountFrom').setValue(null)
          this._byFragId('amountTo').setValue(null)
          this._byFragId('statusSelect').setSelectedKeys([])

          this._sCustomerID = null
          this._oDateFrom = null
          this._oDateTo = null
          this._nAmountFrom = null
          this._nAmountTo = null
          this._aStatuses = []

          this._applyToTable([])
          MessageToast.show('Filters cleared.')
        },

        // filter builder
        _buildFilters: function () {
          var aFilters = []

          var oInput = this._byFragId('customerInput')
          var sTypedVal = oInput ? oInput.getValue() : ''

          if (this._sCustomerID) {
            aFilters.push(
              new Filter('customer/ID', FilterOperator.EQ, this._sCustomerID)
            )
          } else if (sTypedVal) {
            aFilters.push(
              new Filter('customer/names', FilterOperator.Contains, sTypedVal)
            )
          }

          // Date range
          if (this._oDateFrom && this._oDateTo) {
            aFilters.push(
              new Filter({
                filters: [
                  new Filter('createdAt', FilterOperator.GE, this._oDateFrom),
                  new Filter('createdAt', FilterOperator.LE, this._oDateTo)
                ],
                and: true
              })
            )
          } else if (this._oDateFrom) {
            aFilters.push(
              new Filter('createdAt', FilterOperator.GE, this._oDateFrom)
            )
          } else if (this._oDateTo) {
            aFilters.push(
              new Filter('createdAt', FilterOperator.LE, this._oDateTo)
            )
          }

          // amount range
          if (
            this._nAmountFrom !== null &&
            this._nAmountFrom !== '' &&
            this._nAmountTo !== null &&
            this._nAmountTo !== ''
          ) {
            aFilters.push(
              new Filter({
                filters: [
                  new Filter(
                    'totalPrice',
                    FilterOperator.GE,
                    parseFloat(this._nAmountFrom)
                  ),
                  new Filter(
                    'totalPrice',
                    FilterOperator.LE,
                    parseFloat(this._nAmountTo)
                  )
                ],
                and: true
              })
            )
          } else if (this._nAmountFrom !== null && this._nAmountFrom !== '') {
            aFilters.push(
              new Filter(
                'totalPrice',
                FilterOperator.GE,
                parseFloat(this._nAmountFrom)
              )
            )
          } else if (this._nAmountTo !== null && this._nAmountTo !== '') {
            aFilters.push(
              new Filter(
                'totalPrice',
                FilterOperator.LE,
                parseFloat(this._nAmountTo)
              )
            )
          }

          // status
          if (this._aStatuses.length > 0) {
            aFilters.push(
              new Filter({
                filters: this._aStatuses.map(function (s) {
                  return new Filter('status', FilterOperator.EQ, s)
                }),
                and: false
              })
            )
          }

          return aFilters
        },

        // connecting the filter with the table
        _applyToTable: function (aFilters) {
          var oView = this.base.getView()
          var oTable = this._findTable(oView)

          if (!oTable) {
            console.warn('CustomFilterPanel: table not found in view tree.')
            MessageToast.show('Table not found.')
            return
          }

          if (oTable.isA('sap.ui.mdc.Table')) {
            var oBinding = oTable.getRowBinding()
            if (oBinding) {
              oBinding.filter(aFilters)
              MessageToast.show('Filters applied.')
              return
            }
          }

          if (oTable.isA('sap.ui.comp.smarttable.SmartTable')) {
            var oInner = oTable.getTable()
            var oBind = oInner.getBinding('rows') || oInner.getBinding('items')
            if (oBind) {
              oBind.filter(aFilters)
              MessageToast.show('Filters applied.')
              return
            }
          }

          MessageToast.show('Binding not ready — try again.')
        },

        _findTable: function (oControl) {
          if (!oControl) return null
          if (
            oControl.isA &&
            (oControl.isA('sap.ui.mdc.Table') ||
              oControl.isA('sap.ui.comp.smarttable.SmartTable'))
          )
            return oControl

          var aChildren = [].concat(
            (oControl.getContent && oControl.getContent()) || [],
            (oControl.getItems && oControl.getItems()) || [],
            (oControl.getSections && oControl.getSections()) || []
          )
          for (var i = 0; i < aChildren.length; i++) {
            var oFound = this._findTable(aChildren[i])
            if (oFound) return oFound
          }
          return null
        }
      }
    )
  }
)
