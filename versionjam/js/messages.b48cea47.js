(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["messages"],{"098d":function(e,t,s){},"0f7d":function(e,t,s){"use strict";var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"message"},[s("p",[e._v(e._s(e.typedText))])])},a=[],i=(s("ac4d"),s("8a81"),s("ac6a"),s("28a5"),new AudioContext),c="sawtooth",r=5,u=8,o=10,l=function(e,t){return Math.floor(Math.random()*(t-e))+e},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:440+l(-40,40),t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.5,s=i.createOscillator();s.frequency.value=e+8*(o-50),s.type=c;var n=i.createGain();n.connect(i.destination),n.gain.value=r/100,n.gain.exponentialRampToValueAtTime(1e-5,i.currentTime+.1+u/100),s.connect(n),s.start(0),s.stop(i.currentTime+t)},h={name:"Message",props:{text:String},data:function(){return{typedText:"",speed:30}},watch:{text:function(){this.shutup&&this.shutup(),this.typedText="",this.shutup=this.machinetalk(this.text)}},created:function(){this.shutup=this.machinetalk(this.text)},destroyed:function(){this.shutup()},methods:{machinetalk:function(e){var t=this,s=e.split(/\b/),n=0,a=100,i=1-this.speed/120,c=[],r=!0,u=!1,o=void 0;try{for(var l,h=function(){var e=l.value;if(/\w/.test(e))for(var s=Math.ceil(e.length/3),r=function(s){n+=100*i;var r=440+a;c.push(setTimeout(function(){return f(r,.5*i)},n)),c.push(setTimeout(function(){t.typedText+=e.slice(3*s,3*s+3)},n))},u=0;u<s;u++)r(u);else switch(c.push(setTimeout(function(){t.typedText+=e},n+1)),e.trim()){case"":n+=50*i,a=90;break;case",":case";":n+=400*i,a=100;break;case".":case"?":case"!":case"\n":n+=800*i;break;case"...":n+=1200*i;break;default:break}},d=s[Symbol.iterator]();!(r=(l=d.next()).done);r=!0)h()}catch(e){u=!0,o=e}finally{try{r||null==d.return||d.return()}finally{if(u)throw o}}return setTimeout(function(){t.$emit("endmessage")},n+1e3),function(){c.forEach(function(e){return clearTimeout(e)})}}}},d=h,m=(s("105f"),s("2877")),p=Object(m["a"])(d,n,a,!1,null,"dbb36b94",null);p.options.__file="Message.vue";t["a"]=p.exports},"105f":function(e,t,s){"use strict";var n=s("098d"),a=s.n(n);a.a},8431:function(e,t,s){},eaad:function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"messages"}},[s("h1",[e.currentMessage>0?s("div",{staticClass:"icon left",on:{click:function(t){e.currentMessage--}}}):e._e(),e._v("\n    "+e._s(e.messages[e.currentMessage].title)+"\n    "),e.currentMessage<e.messages.length-1?s("div",{staticClass:"icon right",on:{click:function(t){e.currentMessage++}}}):e._e()]),s("Message",{attrs:{text:e.messages[e.currentMessage].text}})],1)},a=[],i=(s("cadf"),s("551c"),s("097d"),s("7de0")),c=s("0f7d"),r={name:"Messages",components:{Message:c["a"]},data:function(){return{currentMessage:i["m"].messages.length-1,messages:i["m"].messages}},mounted:function(){setTimeout(function(){document.querySelector(".button.map").classList.remove("new")},100)}},u=r,o=(s("f571"),s("2877")),l=Object(o["a"])(u,n,a,!1,null,null,null);l.options.__file="Messages.vue";t["default"]=l.exports},f571:function(e,t,s){"use strict";var n=s("8431"),a=s.n(n);a.a}}]);
//# sourceMappingURL=messages.b48cea47.js.map