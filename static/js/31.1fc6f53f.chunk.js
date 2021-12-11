(this["webpackJsonpcrowfi-frontend"]=this["webpackJsonpcrowfi-frontend"]||[]).push([[31],{1096:function(e,n,t){"use strict";t.d(n,"a",(function(){return a})),t.d(n,"b",(function(){return l}));var c=t(4),i=t(36),r=t(86),s=t(212),a=function(e){var n=Object(i.c)((function(n){return n.teams.data[e]})),t=Object(r.b)();return Object(c.useEffect)((function(){t(Object(s.b)(e))}),[e,t]),n},l=function(){var e=Object(i.c)((function(e){return e.teams})),n=e.isInitialized,t=e.isLoading,a=e.data,l=Object(r.b)();return Object(c.useEffect)((function(){l(Object(s.c)())}),[l]),{teams:a,isInitialized:n,isLoading:t}}},1243:function(e,n,t){"use strict";var c,i=t(9),r=(t(4),t(12)),s=t(2),a=t(306),l=t(15),b=t(132),o=t(0),d=function(){var e=Object(l.b)().t;return Object(o.jsx)(s.y,{mb:"32px",isActive:!0,children:Object(o.jsx)(s.z,{children:Object(o.jsxs)(s.ab,{alignItems:["start",null,"center"],justifyContent:["start",null,"space-between"],flexDirection:["column",null,"row"],children:[Object(o.jsxs)("div",{children:[Object(o.jsx)(s.cb,{scale:"lg",mb:"8px",children:e("You haven\u2019t set up your profile yet!")}),Object(o.jsx)(s.uc,{children:e("You can do this at any time by clicking on your profile picture in the menu")})]}),Object(o.jsx)(s.t,{as:b.a,to:"/create-profile",id:"teamsPageSetUpProfile",mt:["16px",null,0],children:e("Set up now")})]})})})},j=r.e.div(c||(c=Object(i.a)(["\n  border-bottom: 2px solid ",";\n  margin-bottom: 24px;\n  padding-bottom: 24px;\n"])),(function(e){return e.theme.colors.textSubtle}));n.a=function(){var e=Object(l.b)().t,n=Object(a.d)(),t=n.isInitialized,c=n.profile,i=t&&!c;return Object(o.jsxs)(o.Fragment,{children:[i&&Object(o.jsx)(d,{}),Object(o.jsxs)(j,{children:[Object(o.jsx)(s.cb,{as:"h1",scale:"xxl",color:"secondary",children:e("Teams & Profiles")}),Object(o.jsx)(s.uc,{bold:!0,children:e("Show off your stats and collectibles with your unique profile. Team features will be revealed soon!")})]})]})}},2013:function(e,n,t){"use strict";t.r(n);t(4);var c,i,r,s,a,l,b,o,d=t(2),j=t(312),u=t.n(j),x=t(1096),O=t(230),m=t(15),f=t(9),p=t(12),h=t(132),g=t(0),v=p.e.div(c||(c=Object(f.a)(["\n  align-self: stretch;\n  background: ",";\n  flex: none;\n  padding: 16px 0;\n  text-align: center;\n  width: 56px;\n"])),(function(e){return function(e){return e.isDark?"linear-gradient(139.73deg, #142339 0%, #24243D 47.4%, #37273F 100%)":"linear-gradient(139.73deg, #E6FDFF 0%, #EFF4F5 46.87%, #F3EFFF 100%)"}(e.theme)})),y=p.e.div(i||(i=Object(f.a)(["\n  align-items: start;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  padding: 24px;\n\n  "," {\n    align-items: center;\n    flex-direction: row;\n    font-size: 40px;\n  }\n"])),(function(e){return e.theme.mediaQueries.md})),w=p.e.div(r||(r=Object(f.a)(["\n  flex: 1;\n"]))),S=p.e.img(s||(s=Object(f.a)(["\n  border-radius: 50%;\n"]))),F=Object(p.e)(d.cb).attrs({as:"h3"})(a||(a=Object(f.a)(["\n  font-size: 24px;\n\n  "," {\n    font-size: 40px;\n  }\n"])),(function(e){return e.theme.mediaQueries.md})),z=p.e.div(l||(l=Object(f.a)(["\n  flex: none;\n  margin-right: 8px;\n\n  "," {\n    height: 64px;\n    width: 64px;\n  }\n\n  "," {\n    display: none;\n  }\n"])),S,(function(e){return e.theme.mediaQueries.md})),k=p.e.div(b||(b=Object(f.a)(["\n  display: none;\n\n  "," {\n    display: block;\n    margin-left: 24px;\n\n    "," {\n      height: 128px;\n      width: 128px;\n    }\n  }\n"])),(function(e){return e.theme.mediaQueries.md}),S),I=Object(p.e)(d.y)(o||(o=Object(f.a)(["\n  margin-bottom: 16px;\n"]))),E=function(e){var n=e.rank,t=e.team,c=Object(m.b)().t,i=Object(g.jsx)(S,{src:"/images/teams/".concat(t.images.md),alt:"team avatar"});return Object(g.jsx)(I,{id:"team-".concat(t.id),children:Object(g.jsxs)(d.ab,{children:[Object(g.jsx)(v,{children:Object(g.jsx)(d.uc,{bold:!0,fontSize:"24px",children:n})}),Object(g.jsxs)(y,{children:[Object(g.jsxs)(w,{children:[Object(g.jsxs)(d.ab,{alignItems:"center",mb:"16px",children:[Object(g.jsx)(z,{children:i}),Object(g.jsx)(F,{children:t.name})]}),Object(g.jsx)(d.uc,{as:"p",color:"textSubtle",pr:"24px",mb:"16px",children:c(t.description)}),Object(g.jsxs)(d.ab,{children:[Object(g.jsxs)(d.ab,{children:[Object(g.jsx)(d.Tb,{width:"24px",mr:"8px",style:{alignSelf:"center"}}),Object(g.jsx)(d.uc,{fontSize:"24px",bold:!0,children:t.points.toLocaleString()})]}),Object(g.jsxs)(d.ab,{ml:"24px",children:[Object(g.jsx)(d.R,{width:"24px",mr:"8px",style:{alignSelf:"center"}}),Object(g.jsx)(d.uc,{fontSize:"24px",bold:!0,children:t.users.toLocaleString()})]})]})]}),Object(g.jsx)(d.t,{as:h.a,to:"/teams/".concat(null===t||void 0===t?void 0:t.id),variant:"secondary",scale:"sm",children:c("See More")}),Object(g.jsx)(k,{children:i})]})]})})},L=t(1243);n.default=function(){var e=Object(m.b)().t,n=Object(x.b)(),t=n.teams,c=n.isLoading,i=Object.values(t),r=u()(i,["points","id","name"],["desc","asc","asc"]);return Object(g.jsxs)(O.b,{children:[Object(g.jsx)(L.a,{}),Object(g.jsxs)(d.ab,{alignItems:"center",justifyContent:"space-between",mb:"32px",children:[Object(g.jsx)(d.cb,{scale:"xl",children:e("Teams")}),c&&Object(g.jsx)(d.i,{spin:!0})]}),r.map((function(e,n){return Object(g.jsx)(E,{rank:n+1,team:e},e.id)}))]})}}}]);
//# sourceMappingURL=31.1fc6f53f.chunk.js.map