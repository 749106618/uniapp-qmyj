(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/web/mshop/list"],{

/***/ 545:
/*!************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/qianmengApp/main.js?{"page":"pages%2Fweb%2Fmshop%2Flist"} ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
__webpack_require__(/*! uni-pages */ 4);
var _mpvuePageFactory = _interopRequireDefault(__webpack_require__(/*! mpvue-page-factory */ 17));
var _list = _interopRequireDefault(__webpack_require__(/*! ./pages/web/mshop/list.vue */ 546));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
Page((0, _mpvuePageFactory.default)(_list.default));

/***/ }),

/***/ 546:
/*!***************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _list_vue_vue_type_template_id_7294cc6a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.vue?vue&type=template&id=7294cc6a& */ 547);
/* harmony import */ var _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list.vue?vue&type=script&lang=js& */ 549);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./list.vue?vue&type=style&index=0&lang=css& */ 551);
/* harmony import */ var _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ 10);






/* normalize component */

var component = Object(_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _list_vue_vue_type_template_id_7294cc6a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _list_vue_vue_type_template_id_7294cc6a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 547:
/*!**********************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue?vue&type=template&id=7294cc6a& ***!
  \**********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_template_id_7294cc6a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./list.vue?vue&type=template&id=7294cc6a& */ 548);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_template_id_7294cc6a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_template_id_7294cc6a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ 548:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue?vue&type=template&id=7294cc6a& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "view",
    { class: { "site-top": _vm.scollDowns, "site-down": _vm.scollTops } },
    [
      _c("view", { staticClass: "goods-search-nav" }, [
        _c(
          "view",
          { staticClass: " flex flexrow flexAic flexAcc flexJcc sore-nav" },
          [
            _c(
              "view",
              {
                staticClass: "li flex flexrow flexJcc flexAic sort",
                class: { now: _vm.ordershow == "sort_default" },
                attrs: { id: "sort_default", eventid: "457b82fc-0" },
                on: { click: _vm.orderShow }
              },
              [
                _vm._v(_vm._s(_vm.defaultSort)),
                _c("text", { staticClass: "i" })
              ]
            ),
            _c(
              "view",
              {
                staticClass: "li flex flexJcc flexAic",
                class: { now: _vm.ordershow == "sort_num" },
                attrs: {
                  id: "sort_num",
                  "data-order": "2",
                  "data-key": "3",
                  eventid: "457b82fc-1"
                },
                on: { click: _vm.orderShow }
              },
              [_vm._v("销量优先")]
            ),
            _c(
              "view",
              {
                staticClass: "li flex flexrow flexJcc flexAic sort",
                class: { now: _vm.ordershow == "sort_show" },
                attrs: { id: "sort_show", eventid: "457b82fc-2" },
                on: { click: _vm.orderShow }
              },
              [_vm._v("筛选"), _c("view", { staticClass: "i" })]
            ),
            _c(
              "view",
              {
                staticClass: "li",
                staticStyle: {
                  width: "2em",
                  flex: "none",
                  "font-size": "1.2em"
                },
                attrs: { eventid: "457b82fc-3" },
                on: {
                  click: function($event) {
                    _vm.plist = !_vm.plist
                  }
                }
              },
              [
                _c("view", {
                  staticClass: "wwi-icon",
                  class: {
                    "wwi-icon-yingyongAPP": _vm.plist,
                    "wwi-icon-liebiao": !_vm.plist
                  }
                })
              ]
            )
          ]
        ),
        _c(
          "view",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.sortMask,
                expression: "sortMask"
              }
            ],
            staticClass: "goods-sort-inner flex flexcol",
            attrs: { catchtouchmove: "true" }
          },
          [
            _c(
              "view",
              {
                staticClass: "span flex flexJcs flexAic",
                class: { now: _vm.defaultSort == "综合排序" },
                attrs: {
                  "data-name": "综合排序",
                  "data-order": "",
                  "data-key": "",
                  eventid: "457b82fc-4"
                },
                on: { click: _vm.sortShow }
              },
              [
                _vm._v("综合排序"),
                _c("view", { staticClass: "wwi-icon wwi-icon-duihao" })
              ]
            ),
            _c(
              "view",
              {
                staticClass: "span flex flexJcs flexAic",
                class: { now: _vm.defaultSort == "价格从高到低" },
                attrs: {
                  "data-name": "价格从高到低",
                  "data-order": "2",
                  "data-key": "2",
                  eventid: "457b82fc-5"
                },
                on: { click: _vm.sortShow }
              },
              [
                _vm._v("价格从高到低"),
                _c("view", { staticClass: "wwi-icon wwi-icon-duihao" })
              ]
            ),
            _c(
              "view",
              {
                staticClass: "span flex flexJcs flexAic",
                class: { now: _vm.defaultSort == "价格从低到高" },
                attrs: {
                  "data-name": "价格从低到高",
                  "data-order": "1",
                  "data-key": "2",
                  eventid: "457b82fc-6"
                },
                on: { click: _vm.sortShow }
              },
              [
                _vm._v("价格从低到高"),
                _c("view", { staticClass: "wwi-icon wwi-icon-duihao" })
              ]
            ),
            _c(
              "view",
              {
                staticClass: "span flex flexJcs flexAic",
                class: { now: _vm.defaultSort == "人气排序" },
                attrs: {
                  "data-name": "人气排序",
                  "data-order": "2",
                  "data-key": "5",
                  eventid: "457b82fc-7"
                },
                on: { click: _vm.sortShow }
              },
              [
                _vm._v("人气排序"),
                _c("view", { staticClass: "wwi-icon wwi-icon-duihao" })
              ]
            )
          ]
        )
      ]),
      _c("view", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.sortMask,
            expression: "sortMask"
          }
        ],
        staticClass: "mask",
        attrs: { eventid: "457b82fc-8" },
        on: {
          click: function($event) {
            _vm.sortMask = false
          }
        }
      }),
      _c("view", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showDv == 1,
            expression: "showDv==1"
          }
        ],
        staticClass: "wwiapp-full-mask-bg",
        attrs: { catchtouchmove: "true", eventid: "457b82fc-9" },
        on: {
          click: function($event) {
            _vm.showDv = 2
          }
        }
      }),
      _vm.showDv > 0
        ? _c(
            "view",
            {
              staticClass: "wwiapp-full-mask",
              class: {
                hide: _vm.showDv == 0,
                left: _vm.showDv == 1,
                right: _vm.showDv == 2
              },
              attrs: { catchtouchmove: "reue" }
            },
            [
              _c(
                "view",
                { staticClass: "wwiapp-full-mask-block flex flexcol" },
                [
                  _c(
                    "scroll-view",
                    { staticClass: "sea-list", attrs: { "scroll-y": "" } },
                    [
                      _c("view", { staticClass: "dl" }, [
                        _c("input", {
                          attrs: { type: "text", value: "", disabled: "true" }
                        }),
                        _c("view", { staticClass: "dt" }, [_vm._v("价格区间")]),
                        _c("view", { staticClass: "dd flex flexAic flexrow" }, [
                          _c("view", { staticClass: "inp-block" }, [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.advShow.price_from,
                                  expression: "advShow.price_from"
                                }
                              ],
                              attrs: {
                                type: "number",
                                id: "price_from",
                                placeholder: "最低价",
                                "placeholder-style": "color:#4caf50;",
                                eventid: "457b82fc-10"
                              },
                              domProps: { value: _vm.advShow.price_from },
                              on: {
                                input: function($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.advShow.price_from = $event.target.value
                                }
                              }
                            })
                          ]),
                          _c("view", {}, [_vm._v("-")]),
                          _c("view", { staticClass: "inp-block" }, [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.advShow.price_to,
                                  expression: "advShow.price_to"
                                }
                              ],
                              attrs: {
                                type: "number",
                                disabled: _vm.advShow.price_from < 0.01,
                                id: "price_to",
                                placeholder: "最高价",
                                "placeholder-style": "color:#f44336;",
                                eventid: "457b82fc-11"
                              },
                              domProps: { value: _vm.advShow.price_to },
                              on: {
                                input: function($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.advShow.price_to = $event.target.value
                                }
                              }
                            })
                          ])
                        ])
                      ])
                    ]
                  ),
                  _c(
                    "view",
                    { staticClass: "sea-btn flex flexrow" },
                    [
                      _c(
                        "button",
                        {
                          staticClass: "btn-g btnA",
                          attrs: { eventid: "457b82fc-12" },
                          on: {
                            click: function($event) {
                              _vm.searchBtn("reset")
                            }
                          }
                        },
                        [_vm._v("重置")]
                      ),
                      _c(
                        "button",
                        {
                          staticClass: "btn-g btnB",
                          attrs: { eventid: "457b82fc-13" },
                          on: {
                            click: function($event) {
                              _vm.searchBtn("go")
                            }
                          }
                        },
                        [_vm._v("确定")]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ]
          )
        : _vm._e(),
      _c(
        "view",
        {
          staticClass: "goods-control",
          class: { grid: _vm.plist, list: !_vm.plist }
        },
        [
          _c(
            "view",
            { staticClass: "goods-secrch-list" },
            [
              !_vm.goods_list.length
                ? _c(
                    "view",
                    {
                      staticClass: "wwi-nodata",
                      staticStyle: { position: "absolute", "z-index": "-1" }
                    },
                    [_vm._m(0)]
                  )
                : _vm._e(),
              _vm._l(_vm.goods_list, function(item, index2) {
                return _vm.goods_list.length > 0
                  ? _c("view", { key: index2, staticClass: "goods-item" }, [
                      _c(
                        "view",
                        { staticClass: "goods-pic" },
                        [
                          _c(
                            "navigator",
                            {
                              staticClass: "a",
                              attrs: {
                                url:
                                  "/pages/web/mshop/item?msid=" +
                                  _vm.mid +
                                  "&goodsid=" +
                                  item.goods_id +
                                  "&fid=" +
                                  item.jfx_id
                              }
                            },
                            [
                              _c("image", {
                                attrs: {
                                  src: item.goods_image_url,
                                  "lazy-load": ""
                                }
                              })
                            ]
                          )
                        ],
                        1
                      ),
                      _c("view", { staticClass: "goods-info" }, [
                        _c(
                          "view",
                          { staticClass: "goods-name" },
                          [
                            _c(
                              "navigator",
                              {
                                staticClass: "a",
                                attrs: {
                                  url:
                                    "/pages/web/mshop/item?msid=" +
                                    _vm.mid +
                                    "&goodsid=" +
                                    item.goods_id +
                                    "&fid=" +
                                    item.jfx_id
                                }
                              },
                              [
                                _c("text", { staticClass: "h4" }, [
                                  _vm._v(_vm._s(item.goods_name))
                                ]),
                                _c("text", { staticClass: "h6" }, [
                                  _vm._v(_vm._s(item.goods_jingle))
                                ])
                              ]
                            )
                          ],
                          1
                        ),
                        _c(
                          "view",
                          { staticClass: "goods-sale" },
                          [
                            _c(
                              "navigator",
                              {
                                staticClass: "flex flexJcs flexAic",
                                attrs: {
                                  url:
                                    "/pages/web/mshop/item?msid=" +
                                    _vm.mid +
                                    "&goodsid=" +
                                    item.goods_id +
                                    "&fid=" +
                                    item.jfx_id
                                }
                              },
                              [
                                _c("view", { staticClass: "goods-price" }, [
                                  _vm._v("￥"),
                                  _c("text", { staticClass: "em" }, [
                                    _vm._v(_vm._s(item.goods_price))
                                  ]),
                                  item.sole_flag
                                    ? _c(
                                        "view",
                                        { staticClass: "phone-sale" },
                                        [
                                          _c("view", {
                                            staticClass:
                                              "wwi-icon wwi-icon-shouji"
                                          }),
                                          _vm._v("手机专享")
                                        ]
                                      )
                                    : _vm._e()
                                ]),
                                item.is_virtual == 1
                                  ? _c("text", { staticClass: "sale-type" }, [
                                      _vm._v("虚拟")
                                    ])
                                  : _vm._e(),
                                item.is_presell == 1
                                  ? _c("text", { staticClass: "sale-type" }, [
                                      _vm._v("预")
                                    ])
                                  : _vm._e(),
                                item.is_fcode == 1
                                  ? _c("text", { staticClass: "sale-type" }, [
                                      _vm._v("F")
                                    ])
                                  : _vm._e(),
                                item.group_flag || item.xianshi_flag
                                  ? _c("text", { staticClass: "sale-type" }, [
                                      _vm._v("降")
                                    ])
                                  : _vm._e(),
                                item.have_gift == 1
                                  ? _c("text", { staticClass: "sale-type" }, [
                                      _vm._v("赠")
                                    ])
                                  : _vm._e()
                              ]
                            )
                          ],
                          1
                        ),
                        _c(
                          "view",
                          { staticClass: "goods-assist" },
                          [
                            _c(
                              "navigator",
                              {
                                staticClass: "goods-sold",
                                attrs: {
                                  url:
                                    "/pages/web/mshop/item?msid=" +
                                    _vm.mid +
                                    "&goodsid=" +
                                    item.goods_id +
                                    "&fid=" +
                                    item.jfx_id
                                }
                              },
                              [
                                _vm._v("销量"),
                                _c("text", { staticClass: "em" }, [
                                  _vm._v(_vm._s(item.sale_count))
                                ])
                              ]
                            ),
                            _c("view", { staticClass: "goods-store" }, [
                              _c("view", {
                                staticClass: "wwi-icon wwi-icon-gouwuche1",
                                attrs: { eventid: "457b82fc-14-" + index2 },
                                on: {
                                  click: function($event) {
                                    _vm.getGoodsmask(item)
                                  }
                                }
                              })
                            ])
                          ],
                          1
                        )
                      ])
                    ])
                  : _vm._e()
              })
            ],
            2
          )
        ]
      ),
      _c("wwi-goods-mask", {
        ref: "wwiGoodsMask",
        attrs: {
          goods: Number(_vm.goodsId),
          fid: Number(_vm.fid),
          eventid: "457b82fc-15",
          mpcomid: "457b82fc-0"
        },
        on: { change: _vm.getuu }
      })
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("view", { staticClass: "no-main" }, [
      _c("view", { staticClass: "wwi-icon wwi-icon-zhangdan_quxiao" }),
      _c("view", { staticClass: "dl" }, [
        _c("view", { staticClass: "dt" }, [_vm._v("没有查询到相关商品")]),
        _c("view", { staticClass: "dd" }, [
          _vm._v("你可以换个关键词或条件查询")
        ])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ 549:
/*!****************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./list.vue?vue&type=script&lang=js& */ 550);
/* harmony import */ var _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 550:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;


















































































































var _wwiGoodsMask = _interopRequireDefault(__webpack_require__(/*! ../../../components/wwi-goods-mask.vue */ 171));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  components: {
    wwiGoodsMask: _wwiGoodsMask.default },

  data: function data() {
    return {
      mid: '',
      memberInfo: [],
      offset: '',
      scollDowns: false,
      scollTops: false,
      defaultSort: '综合排序',
      ordershow: 'sort_default',
      sortMask: false,
      hasmore: true,
      curpage: 1,
      skey: '',
      order: '',
      goods_list: [],
      advShow: {
        price_from: '',
        price_to: '' },

      keyword: '',
      gc_id: '',
      showDv: 0,
      plist: false,
      goodsId: '',
      fid: '',
      goodsClass: [] };

  },
  methods: {
    setScrollNum: function setScrollNum(e) {
      if (e.scrollTop < this.offset) {
        this.scollTops = true;
      } else {
        this.scollTops = false;
      }
      this.offset = e.scrollTop;
      if (this.offset > 80) {
        this.scollDowns = true;
      } else {
        this.scollDowns = false;
        this.scollTops = false;
      }
    },
    get_list: function get_list() {var _this2 = this;
      if (!this.hasmore) {
        return false;
      }
      this.hasmore = false;
      var param = {};
      param.page = 10;
      param.curpage = this.curpage;
      if (this.skey != '') {
        param.key = this.skey;
      }
      if (this.order != '') {
        param.order = this.order;
      }
      if (this.advShow.price_from > 0 && this.advShow.price_to > 0) {
        param.price_from = this.advShow.price_from;
        param.price_to = this.advShow.price_to;
      }
      if (this.advShow.keyword != '') {
        param.keyword = this.keyword;
      }
      if (this.advShow.gc_id != '') {
        param.gc_id = this.gc_id;
      }
      param.jfx_id = this.mid;
      this.wwiopt({
        url: '/index.php?app=distribute&wwi=jfx_goods_list',
        data: param,
        success: function success(res) {
          if (res.data.code == 200) {
            _this2.curpage += 1;
            res.data.datas.goods_list.forEach(function (item) {
              _this2.$set(item, 'click', false);
              _this2.$set(item, 'is_load', false);
              _this2.$set(item, 'is_fav', false);
              _this2.goods_list.push(item);
            });
            _this2.hasmore = res.data.hasmore;
          } else {
            uni.showToast({
              title: '列表加载异常',
              icon: "none" });

          }
        } });

    },
    goBack: function goBack() {
      var page = getCurrentPages();
      if (page.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({
          url: '/pages/index' });

      }
    },
    orderShow: function orderShow(e) {
      if (e.target.id == 'sort_default') {
        this.ordershow = 'sort_default';
        if (this.sortMask == true) {
          this.sortMask = false;
        } else {
          this.sortMask = true;
        }

      } else if (e.target.id == 'sort_num') {
        this.order = e.target.dataset.order;
        this.skey = e.target.dataset.key;
        this.hasmore = true;
        this.curpage = 1;
        this.sortMask = false;
        this.goods_list = [];
        this.get_list();
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 300 });

      } else if (e.target.id == 'sort_show') {
        if (this.showDv != 1) {
          this.showDv = 1;
        } else {
          this.showDv = 2;
        }
      }
      this.ordershow = e.target.id;
    },
    sortShow: function sortShow(e) {
      this.defaultSort = e.target.dataset.name;
      this.order = e.target.dataset.order;
      this.skey = e.target.dataset.key;
      this.hasmore = true;
      this.curpage = 1;
      this.sortMask = false;
      this.goods_list = [];
      this.get_list();
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300 });

    },
    searchBtn: function searchBtn(e) {
      if (e == 'reset') {
        this.advShow = {
          price_from: '',
          price_to: '' };

      } else {
        this.hasmore = true;
        this.curpage = 1;
        this.showDv = 2;
        this.goods_list = [];
        this.get_list();
      }
    },
    getGoodsmask: function getGoodsmask(e) {
      this.goodsId = e.goods_id;
      this.fid = e.jfx_id;
      var _this = this;
      setTimeout(function () {
        _this.$refs.wwiGoodsMask.show();
      }, 30);
    },
    getuu: function getuu(e) {
      this.goodsId = e;
    } },

  onLoad: function onLoad(e) {
    if (e.gcid) {
      this.gc_id = e.gcid;
    }
    if (e.keyword) {
      this.keyword = e.keyword;
    }
    if (e.msid) {
      this.mid = e.msid;
      this.get_list();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: "none",
        success: function success() {
          setTimeout(function () {
            var page = getCurrentPages();
            if (page.length > 1) {
              uni.navigateBack();
            } else {
              uni.switchTab({
                url: '/pages/index' });

            }
          }, 1000);
        } });

    }
  },
  onPageScroll: function onPageScroll(e) {
    this.setScrollNum(e);
  },
  onReachBottom: function onReachBottom() {
    this.get_list();
  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 551:
/*!************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue?vue&type=style&index=0&lang=css& ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-1!./node_modules/css-loader??ref--6-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./list.vue?vue&type=style&index=0&lang=css& */ 552);
/* harmony import */ var _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_D_HBuilderX_2_1_3_20190723_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_list_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 552:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-1!./node_modules/css-loader??ref--6-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!C:/Users/Administrator/Desktop/qianmengApp/pages/web/mshop/list.vue?vue&type=style&index=0&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

},[[545,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/web/mshop/list.js.map