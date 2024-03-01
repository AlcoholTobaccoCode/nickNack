(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [649],
  {
    6267: function (e, t, n) {
      "use strict";
      n.d(t, {
        nd: function () {
          return j;
        },
        Iq: function () {
          return v;
        },
        bV: function () {
          return x;
        },
        Vx: function () {
          return p;
        },
        zH: function () {
          return m;
        },
        rD: function () {
          return u;
        },
      });
      var r,
        i = n(7757),
        c = n.n(i),
        s = n(2137),
        a = n(6595);
      function o() {
        return l.apply(this, arguments);
      }
      function l() {
        return (l = (0, s.Z)(
          c().mark(function e() {
            var t, n;
            return c().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (e.next = 2), r;
                  case 2:
                    return (t = e.sent), (e.next = 5), t.get();
                  case 5:
                    return (n = e.sent), e.abrupt("return", d(n.visitorId));
                  case 7:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function d(e) {
        var t = 0;
        return (
          (e = e.substring(0, e.length - 2)).split("").forEach(function (e) {
            t += e.charCodeAt(0) % 5;
          }),
          t < 10 && (t = 10),
          t >= 100 && (t = 99),
          (e = [
            (e = [e.slice(0, 3), t.toString()[0], e.slice(3)].join("")).slice(
              0,
              12
            ),
            t.toString()[1],
            e.slice(12),
          ].join(""))
        );
      }
      function u(e) {
        return f.apply(this, arguments);
      }
      function f() {
        return (f = (0, s.Z)(
          c().mark(function e(t) {
            var n, r;
            return c().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (e.next = 2), o();
                  case 2:
                    return (
                      (n = e.sent),
                      (e.next = 5),
                      fetch(
                        "/local-api/refreshmessage_ten/"
                        // "https://www.linshi-email.com/api/v1/refreshmessage_ten/"
                          .concat(n, "/")
                          .concat(t, "?t=")
                          .concat(Date.now())
                      )
                        .then(function (e) {
                          return e.json();
                        })
                        .then(function (e) {
                          if ("ok" === e.status) return e.list;
                          throw new Error("error");
                        })
                    );
                  case 5:
                    return (r = e.sent), e.abrupt("return", r);
                  case 7:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function m(e) {
        return h.apply(this, arguments);
      }
      function h() {
        return (h = (0, s.Z)(
          c().mark(function e(t) {
            var n, r;
            return c().wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (e.next = 2), o();
                  case 2:
                    return (
                      (n = e.sent),
                      (e.next = 5),
                      fetch(
                        "/local-api/refreshmessage/"
                          .concat(n, "/")
                          .concat(t, "?t=")
                          .concat(Date.now())
                      )
                        .then(function (e) {
                          return e.json();
                        })
                        .then(function (e) {
                          if ("ok" === e.status) return e.list;
                          throw new Error(e.message || "error");
                        })
                    );
                  case 5:
                    return (r = e.sent), e.abrupt("return", r);
                  case 7:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      function p(e) {
        return fetch(
          "/local-api/getemailContent_ten/".concat(e)
        )
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            if ("ok" === e.status) return e.data;
            throw new Error(e.message || "error");
          });
      }
      function x(e) {
        return fetch(
          "/local-api/getemailContent/".concat(e)
        )
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            if ("ok" === e.status) return e.data;
            throw new Error("error");
          });
      }
      function v(e, t) {
        return fetch(
          "/local-api/deleteEmail/"
            .concat(e, "?name_to=")
            .concat(t)
        )
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            if ("ok" === e.status) return e;
            throw new Error("error");
          });
      }
      function j(e, t) {
        return fetch(
          "/local-api/deleteEmail/"
            .concat(e, "?name_to=")
            .concat(t)
        )
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            if ("ok" === e.status) return e;
            throw new Error("error");
          });
      }
      r = a.ZP.load();
    },
    733: function (e, t, n) {
      "use strict";
      n.d(t, {
        Z: function () {
          return a;
        },
      });
      var r = n(5893),
        i = n(7044),
        c = n.n(i),
        s = n(1667);
      function a(e) {
        var t = e.children,
          n = e.disabled,
          i = void 0 !== n && n,
          a = e.loading,
          o = void 0 !== a && a,
          l = e.type,
          d = void 0 === l ? "" : l,
          u = e.onClick,
          f = void 0 === u ? function () {} : u,
          m = e.width,
          h = void 0 === m ? "" : m,
          p = e.style,
          x = void 0 === p ? {} : p;
        return (
          (x = Object.assign({}, x, h ? { width: h } : {})),
          (0, r.jsxs)("button", {
            style: x,
            onClick: f,
            disabled: i || o,
            className: c().btn + " " + (c()[d] || ""),
            children: [t, o && "  ", o && (0, r.jsx)(s.Z, {})],
          })
        );
      }
    },
    3485: function (e, t, n) {
      "use strict";
      n.d(t, {
        Z: function () {
          return a;
        },
      });
      var r = n(5893),
        i = n(7294),
        c = n(8677),
        s = { fontSize: "14px", marginLeft: "10px" };
      function a() {
        var e = (0, i.useState)(10),
          t = e[0],
          n = e[1];
        return (
          (0, i.useEffect)(function () {
            var e = setInterval(function () {
              n(function (e) {
                return e <= 0 ? 10 : e - 1;
              });
            }, 1e3);
            return function () {
              clearInterval(e);
            };
          }, []),
          (0, r.jsx)("span", {
            style: s,
            children: (0, r.jsx)(c.ZP, {
              id: "autoRefresh",
              params: { seconds: t },
            }),
          })
        );
      }
    },
    1667: function (e, t, n) {
      "use strict";
      n.d(t, {
        Z: function () {
          return s;
        },
      });
      var r = n(5893),
        i = n(3017),
        c = n.n(i);
      function s() {
        return (0, r.jsx)("img", {
          alt: "loading",
          className: c().loadingimg,
          src: "data:image/png;base64,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",
        });
      }
    },
    2705: function (e, t, n) {
      "use strict";
      var r = n(6156),
        i = n(5893),
        c = n(7375),
        s = n(3253),
        a = n.n(s),
        o = n(9698),
        l = n.n(o);
      function d(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function u(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? d(Object(n), !0).forEach(function (t) {
                (0, r.Z)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : d(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t)
                );
              });
        }
        return e;
      }
      a().setAppElement("#__next"),
        (t.Z = function (e) {
          var t = e.children,
            n = e.type,
            r = void 0 === n ? "fade" : n,
            s = (0, c.Z)(e, ["children", "type"]),
            o = "ReactModal_".concat(r, "__Content");
          return (0, i.jsx)(
            a(),
            u(
              u({}, s),
              {},
              {
                overlayClassName: {
                  base: l().ReactModal__Overlay,
                  afterOpen: l()["ReactModal__Overlay--after-open"],
                  beforeClose: l()["ReactModal__Overlay--before-close"],
                },
                className: {
                  base: l()[o],
                  afterOpen: l()["".concat(o, "--after-open")],
                  beforeClose: l()["".concat(o, "--before-close")],
                },
                children: t,
              }
            )
          );
        });
    },
    3878: function (e, t, n) {
      "use strict";
      n.d(t, {
        X: function () {
          return i;
        },
      });
      var r = n(7294);
      function i() {
        var e = (0, r.useState)(0),
          t = e[0],
          n = e[1],
          i = (0, r.useState)(0),
          c = i[0],
          s = i[1];
        return (
          (0, r.useEffect)(function () {
            function e() {
              var e = localStorage.getItem("_djwerkjk");
              e && e.match(/^\d+$/) && (e = Number(e));
              var t = new Date(),
                r =
                  0.5123 *
                    (3600 * t.getHours() +
                      60 * t.getMinutes() +
                      t.getSeconds()) +
                  10 * Math.random();
              r < e && e - r < 100 && (r = e),
                (r = parseInt(r)),
                n(r),
                localStorage.setItem("_djwerkjk", r),
                t.setHours(0),
                t.setMinutes(0),
                t.setSeconds(0);
              var i = (t.getTime() - 1652803200605) / 1e3;
              s(parseInt(4455051 + 0.5123 * i + r));
            }
            e();
            var t = setInterval(function () {
              e();
            }, 15e3);
            return function () {
              clearInterval(t);
            };
          }, []),
          { totalCount: c, todayCount: t }
        );
      }
    },
    3649: function (e, t, n) {
      "use strict";
      n.d(t, {
        Z: function () {
          return b;
        },
      });
      var r = n(5893),
        i = n(9008),
        c = n(7294),
        s = n(4823),
        a = n(4955),
        o = n(9249),
        l = n(733),
        d = n(4265),
        u = n(6267),
        f = n(1667),
        m = n(5723),
        h = n(5323),
        p = n.n(h),
        x = n(2705),
        v = n(1327),
        j = n(3485),
        _ = n(8677),
        w = n(197),
        g = n(5437),
        Z = n(9703),
        A = n(3878);
      function b(e) {
        var t = e.locale;
        (0, (0, c.useContext)(w.O).setLocale)(t), (0, _.kn)(t);
        var n = (0, c.useState)(!1),
          f = n[0],
          h = n[1],
          j = (0, c.useState)(""),
          b = j[0],
          y = j[1],
          O = (0, c.useState)(""),
          C = O[0],
          E = O[1],
          N = (0, c.useRef)(0),
          R = (0, m.ZP)(
            b ? "/api/v1/refreshmessage/".concat(b) : null,
            function () {
              return (0, u.zH)(b);
            },
            { refreshInterval: 15e3 }
          ).data;
        function P() {
          var e = C;
          if (
            ((0, a.q)("custom_confirm_click", { email: "_" + e }),
            e.indexOf("@") > -1 && (e = e.split("@")[0]),
            e)
          )
            if (e.length < 1 || e.length > 18)
              o.Am.error((0, _.Ow)({ id: "emailLength", locale: t }));
            else if (e.match(/[^\da-zA-Z_.]/))
              o.Am.error((0, _.Ow)({ id: "emailContains", locale: t }));
            else if (e.match(/^\d/) || e.match(/^_/))
              o.Am.error((0, _.Ow)({ id: "emailStart", locale: t }));
            else {
              var n = e + "@iubridge.com";
              localStorage.setItem("_CTWVctKNRD", n),
                y(n),
                h(!1),
                o.Am.success((0, _.Ow)({ id: "editSuccess", locale: t }));
            }
          else o.Am.error((0, _.Ow)({ id: "emailCanNotNull", locale: t }));
        }
        (0, c.useEffect)(
          function () {
            R && R.length > N.current && ((N.current = R.length), (0, s.mA)(t));
          },
          [R]
        ),
          (0, c.useEffect)(function () {
            var e = (0, s.OD)();
            y(e);
          }, []);
        var q = !R,
          X = (0, A.X)();
        return (0, r.jsxs)("div", {
          children: [
            (0, r.jsxs)(i.default, {
              children: [
                (0, r.jsx)("title", {
                  children: (0, _.Ow)({ id: "title", locale: t }),
                }),
                (0, r.jsx)("meta", {
                  name: "description",
                  content: (0, _.Ow)({ id: "desc", locale: t }),
                }),
              ],
            }),
            (0, r.jsx)(Z.k, { path: "" }),
            (0, r.jsxs)("div", {
              children: [
                (0, r.jsx)(d.Z, {}),
                (0, r.jsx)("div", {
                  className: "mb-50",
                  children: (0, r.jsxs)("div", {
                    className: "container",
                    children: [
                      (0, r.jsxs)("div", {
                        className: "row",
                        children: [
                          (0, r.jsx)("div", {
                            className: "col-12 col-sm-6 left-input",
                            children: (0, r.jsx)("input", {
                              type: "text",
                              disabled: !0,
                              value: b,
                            }),
                          }),
                          (0, r.jsxs)("div", {
                            className:
                              "col-12 col-sm-6 right-opt " + p().btnwrap1,
                            children: [
                              (0, r.jsx)(l.Z, {
                                id: "id_copy",
                                onClick: function () {
                                  (0, a.q)("copy_click", { email: b }),
                                    (0, s.vQ)(b) &&
                                      o.Am.success(
                                        (0, _.Ow)({ id: "copyed", locale: t })
                                      );
                                },
                                children: (0, r.jsx)(_.ZP, { id: "copy" }),
                              }),
                              (0, r.jsx)(l.Z, {
                                onClick: function () {
                                  (0, a.q)("randomEmail_click");
                                  var e = (0, s.OD)(!0);
                                  y(e);
                                },
                                className: "loading_btn",
                                children: (0, r.jsx)(_.ZP, {
                                  id: "changeEmail",
                                }),
                              }),
                              (0, r.jsx)(l.Z, {
                                id: "id_custom",
                                onClick: function () {
                                  (0, a.q)("custom_click"), h(!0);
                                },
                                children: (0, r.jsx)(_.ZP, { id: "custom" }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, r.jsx)("div", {
                        className: "row",
                        children: (0, r.jsxs)("div", {
                          className: "col-12",
                          children: [
                            (0, r.jsx)("h1", {
                              style: { fontSize: "16px" },
                              children: (0, r.jsx)(_.ZP, { id: "noAttack" }),
                            }),
                            (0, r.jsx)("p", {
                              className: p().count,
                              children: (0, r.jsx)(_.ZP, {
                                id: "count",
                                params: {
                                  totalCount: X.totalCount,
                                  todayCount: X.todayCount,
                                },
                              }),
                            }),
                          ],
                        }),
                      }),
                      (0, r.jsx)(k, {
                        locale: t,
                        list: R,
                        email: b,
                        listLoading: q,
                        onRefresh: function () {
                          return (0, m.JG)("/api/v1/refreshmessage/".concat(b));
                        },
                      }),
                      (0, r.jsx)("div", {
                        className: p().preventAbuse,
                        children: (0, r.jsx)(_.ZP, { id: "preventAbuse" }),
                      }),
                      (0, r.jsx)(v.Z, {
                        children: (0, r.jsx)("h3", {
                          style: { textAlign: "center" },
                          children: (0, r.jsx)(_.ZP, { id: "hotQuestions" }),
                        }),
                      }),
                    ],
                  }),
                }),
                (0, r.jsx)(g.Z, {}),
              ],
            }),
            (0, r.jsx)(x.Z, {
              isOpen: f,
              children: (0, r.jsx)("div", {
                className: p().dialogwrap,
                children: (0, r.jsxs)("div", {
                  className: "ui_dialog",
                  children: [
                    (0, r.jsx)("div", {
                      style: { marginBottom: "10px" },
                      children: (0, r.jsx)(_.ZP, { id: "customEmail" }),
                    }),
                    (0, r.jsxs)("div", {
                      children: [
                        (0, r.jsx)("input", {
                          placeholder: (0, _.Ow)({
                            id: "inputEmail",
                            locale: t,
                          }),
                          value: C,
                          onKeyPress: function (e) {
                            "Enter" === e.key && P();
                          },
                          onChange: function (e) {
                            return E(e.target.value);
                          },
                        }),
                        (0, r.jsx)("p", {
                          children: (0, r.jsx)(_.ZP, { id: "char18" }),
                        }),
                      ],
                    }),
                    (0, r.jsxs)("div", {
                      style: { textAlign: "right" },
                      children: [
                        (0, r.jsx)(l.Z, {
                          onClick: function () {
                            (0, a.q)("custom_cancel_click"), h(!1);
                          },
                          className: "btn2",
                          type: "default",
                          children: (0, r.jsx)(_.ZP, { id: "cancel" }),
                        }),
                        (0, r.jsx)(l.Z, {
                          id: "custom_save",
                          onClick: P,
                          children: (0, r.jsx)(_.ZP, { id: "confirm" }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            }),
          ],
        });
      }
      var y = {};
      function k(e) {
        var t = e.list,
          n = e.listLoading,
          i = e.onRefresh,
          d = e.email,
          h = e.locale,
          v = (0, c.useState)(!1),
          w = v[0],
          g = v[1],
          Z = (0, c.useState)(!1),
          A = Z[0],
          b = Z[1],
          k = (0, c.useState)(null),
          O = k[0],
          C = k[1],
          E = (0, c.useState)(!1),
          N = E[0],
          R = E[1],
          P = (0, c.useState)(!1),
          q = P[0],
          X = P[1],
          L = (0, c.useState)(0),
          M = L[0],
          S = L[1],
          G = (0, c.useRef)(),
          D = (0, m.ZP)(
            O ? "/api/v1/getemailContent/".concat(O) : null,
            function () {
              return (0, u.bV)(O);
            }
          ).data;
        return (
          (0, c.useEffect)(
            function () {
              w &&
                D &&
                (0, a.q)("emailItem_load_seccess", {
                  eid: D.eid,
                  date: (0, s.Qx)(D.date, "zh-cn"),
                  from: D.from.name,
                  esubject: D.subject,
                  email: d,
                });
            },
            [w, D]
          ),
          (0, c.useEffect)(function () {
            return function () {
              return clearTimeout(G.current);
            };
          }, []),
          (0, r.jsxs)("div", {
            className: "row",
            children: [
              (0, r.jsxs)("div", {
                className: "col-12",
                children: [
                  (0, r.jsxs)("div", {
                    className: "list-opt",
                    children: [
                      w &&
                        (0, r.jsxs)("div", {
                          className: p().btnwrap,
                          children: [
                            (0, r.jsxs)(l.Z, {
                              id: "id_btn_back",
                              onClick: function () {
                                (0, a.q)("back_click"),
                                  g(!1),
                                  setTimeout(function () {
                                    window.scrollTo(0, M);
                                  }, 50);
                              },
                              children: [
                                "<<",
                                (0, r.jsx)(_.ZP, { id: "back" }),
                              ],
                            }),
                            (0, r.jsx)(l.Z, {
                              type: "danger",
                              onClick: function () {
                                (0, a.q)("delete_click"), R(!0);
                              },
                              children: (0, r.jsx)(_.ZP, { id: "delete" }),
                            }),
                          ],
                        }),
                      !w &&
                        (0, r.jsxs)("div", {
                          className: p().refresh_wrap,
                          children: [
                            (0, r.jsx)(l.Z, {
                              id: "id_refresh_email",
                              loading: n || A,
                              onClick: function () {
                                (0, a.q)("changeFake_click"),
                                  b(!0),
                                  (G.current = setTimeout(function () {
                                    b(!1);
                                  }, 2e3));
                              },
                              children: (0, r.jsx)(_.ZP, {
                                id: "refreshEmail",
                              }),
                            }),
                            (0, r.jsx)(j.Z, {}),
                          ],
                        }),
                    ],
                  }),
                  (0, r.jsx)("div", {
                    className: "e-content",
                    id: "id_e_content",
                    style: { display: "none" },
                  }),
                  !w &&
                    (0, r.jsxs)("div", {
                      className: "email-list",
                      id: "id_email_list",
                      children: [
                        n &&
                          (0, r.jsxs)("div", {
                            style: { textAlign: "center", marginTop: "20px" },
                            children: [
                              (0, r.jsx)(_.ZP, { id: "waiting" }),
                              "\xa0\xa0",
                              (0, r.jsx)(f.Z, {}),
                            ],
                          }),
                        !n &&
                          t &&
                          0 === t.length &&
                          (0, r.jsxs)("div", {
                            className: "t-c p-10",
                            children: [
                              (0, r.jsx)(_.ZP, { id: "emptyWait" }),
                              "\xa0\xa0",
                              (0, r.jsx)(f.Z, {}),
                            ],
                          }),
                        (0, r.jsx)("div", {
                          children:
                            t &&
                            t.length > 0 &&
                            t.map(function (e) {
                              return (0, r.jsxs)(
                                "div",
                                {
                                  className:
                                    "email-item " +
                                    (e.eid === O ? "email-item-selected" : ""),
                                  onClick: function () {
                                    return (function (e) {
                                      (y = e),
                                        g(!0),
                                        (0, a.q)("emailItem_click", {
                                          eid: e.eid,
                                        }),
                                        C(e.eid),
                                        S(window.scrollY),
                                        window.scrollTo(0, 0);
                                    })(e);
                                  },
                                  children: [
                                    (0, r.jsxs)("div", {
                                      className: "email-d-w",
                                      children: [
                                        (0, r.jsxs)("div", {
                                          className: "email-from",
                                          children: [
                                            e.name_from,
                                            "<",
                                            e.address_from,
                                            ">",
                                          ],
                                        }),
                                        (0, r.jsx)("div", {
                                          className: "email-date",
                                          children: (0, s.Qx)(e.e_date, h),
                                        }),
                                      ],
                                    }),
                                    (0, r.jsx)("div", {
                                      className: "email-title",
                                      children: e.e_subject,
                                    }),
                                  ],
                                },
                                e.eid
                              );
                            }),
                        }),
                      ],
                    }),
                  w &&
                    (0, r.jsxs)("div", {
                      children: [
                        !D &&
                          (0, r.jsx)("div", {
                            style: { textAlign: "center", padding: "50px 0" },
                            children: (0, r.jsx)(f.Z, {}),
                          }),
                        D &&
                          (0, r.jsxs)("div", {
                            children: [
                              (0, r.jsxs)("div", {
                                className: "email-item bg-f5",
                                children: [
                                  (0, r.jsxs)("div", {
                                    className: "email-d-w",
                                    children: [
                                      (0, r.jsx)("div", {
                                        className: "email-from mb-5",
                                        children: D.subject,
                                      }),
                                      (0, r.jsxs)("div", {
                                        className: "email-date content-date",
                                        children: [
                                          (0, r.jsx)("span", {
                                            children: (0, r.jsx)(_.ZP, {
                                              id: "time",
                                            }),
                                          }),
                                          (0, s.Qx)(D.date, h),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, r.jsxs)("div", {
                                    className: "email-title",
                                    children: [
                                      (0, r.jsx)("span", {
                                        children: (0, r.jsx)(_.ZP, {
                                          id: "sendPerson",
                                        }),
                                      }),
                                      D.from.name,
                                      "<",
                                      D.from.address,
                                      ">",
                                    ],
                                  }),
                                ],
                              }),
                              (0, r.jsx)("div", {
                                className: "e-c1 " + p().emailContent,
                                dangerouslySetInnerHTML: { __html: D.html },
                              }),
                            ],
                          }),
                      ],
                    }),
                ],
              }),
              (0, r.jsx)(x.Z, {
                isOpen: N,
                children: (0, r.jsx)("div", {
                  className: p().dialogwrap,
                  children: (0, r.jsxs)("div", {
                    className: "ui_dialog",
                    children: [
                      (0, r.jsx)("div", {
                        style: { marginBottom: "10px" },
                        children: (0, r.jsx)(_.ZP, { id: "confirmDelete" }),
                      }),
                      (0, r.jsxs)("div", {
                        style: { textAlign: "right" },
                        children: [
                          (0, r.jsx)(l.Z, {
                            onClick: function () {
                              return R(!1);
                            },
                            className: "btn2",
                            type: "default",
                            children: (0, r.jsx)(_.ZP, { id: "cancel" }),
                          }),
                          (0, r.jsxs)(l.Z, {
                            id: "custom_save",
                            onClick: function () {
                              y.name_to
                                ? ((0, a.q)("delete_confirm_click", {
                                    type: "delete_email",
                                  }),
                                  X(!0),
                                  (0, u.nd)(y.eid, y.name_to)
                                    .then(function () {
                                      o.Am.success(
                                        (0, _.Ow)({
                                          id: "deleteSuccess",
                                          locale: h,
                                        })
                                      ),
                                        R(!1),
                                        g(!1),
                                        X(!1),
                                        i();
                                    })
                                    .catch(function (e) {
                                      (0, a.q)("error_msg", {
                                        type: "delete_email",
                                        message: e.message,
                                        to: y.name_to,
                                        seqno: y.seqno,
                                      }),
                                        X(!1),
                                        o.Am.error(
                                          (0, _.Ow)({
                                            id: "optError",
                                            locale: h,
                                          })
                                        );
                                    }))
                                : o.Am.error(
                                    (0, _.Ow)({ id: "loading", locale: h })
                                  );
                            },
                            disabled: q,
                            children: [
                              (0, r.jsx)(_.ZP, { id: "confirm" }),
                              "\xa0\xa0",
                              " ",
                              q && (0, r.jsx)(f.Z, {}),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
            ],
          })
        );
      }
    },
    4955: function (e, t, n) {
      "use strict";
      function r(e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        window.gtag && e && window.gtag("event", e, t);
      }
      n.d(t, {
        q: function () {
          return r;
        },
      });
    },
    7044: function (e) {
      e.exports = {
        btn: "Button_btn__opem7",
        success: "Button_success__3xn67",
        danger: "Button_danger__203L2",
        default: "Button_default__jYu3N",
      };
    },
    3017: function (e) {
      e.exports = {
        loadingimg: "Loading_loadingimg__2SvcE",
        routeanim: "Loading_routeanim__29VGW",
      };
    },
    9698: function (e) {
      e.exports = {
        ReactModal__Overlay: "modal_ReactModal__Overlay__3t07k",
        "ReactModal__Overlay--after-open":
          "modal_ReactModal__Overlay--after-open__3tPY0",
        "ReactModal__Overlay--before-close":
          "modal_ReactModal__Overlay--before-close__1ROhK",
        ReactModal_fade__Content: "modal_ReactModal_fade__Content___o3pf",
        "ReactModal_fade__Content--after-open":
          "modal_ReactModal_fade__Content--after-open__1j9QP",
        "ReactModal_fade__Content--before-close":
          "modal_ReactModal_fade__Content--before-close__1Q3jC",
        "ReactModal_slide-up__Content":
          "modal_ReactModal_slide-up__Content__2-flp",
        "ReactModal_slide-up__Content--after-open":
          "modal_ReactModal_slide-up__Content--after-open__2tj2u",
        "ReactModal_slide-up__Content--before-close":
          "modal_ReactModal_slide-up__Content--before-close__WxWtT",
      };
    },
    5323: function (e) {
      e.exports = {
        btnwrap: "Home_btnwrap__1oLWm",
        emailContent: "Home_emailContent__1jReH",
        btnwrap1: "Home_btnwrap1__SpWAs",
        dialogwrap: "Home_dialogwrap__1QZeC",
        count: "Home_count__3GOtg",
        refresh_wrap: "Home_refresh_wrap__3hUQL",
        preventAbuse: "Home_preventAbuse__dG8Lc",
        frError: "Home_frError__2aehW",
        defaultwhitecard: "Home_defaultwhitecard__DCALl",
        defaultwhitecardwrap: "Home_defaultwhitecardwrap__3FmcJ",
        p1: "Home_p1__2cUJD",
        p2: "Home_p2__33AyT",
      };
    },
  },
]);
