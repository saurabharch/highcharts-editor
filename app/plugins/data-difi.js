highed.plugins.import.install("Difi",{description:'Imports data from the Norwegian Agency for Public Management and eGovernment. <a href="http://difi.no" target="_blank">www.difi.no</a>',treatAs:"csv",fetchAs:!1,defaultURL:"http://hotell.difi.no/api/json/fad/lonn/a-tabell",options:{includeFields:{type:"string",label:"Fields to include, separate by whitespace",default:"trinn brutto-mnd"}},filter:function(e,i,n){var t=[],a=[];try{e=JSON.parse(e)}catch(e){n(e)}i.includeFields=highed.arrToObj(i.includeFields.split(" ")),highed.isArr(e.entries)&&(e.entries=e.entries.map(function(e){var n={};return Object.keys(i.includeFields).forEach(function(i){n[i]=e[i]}),n}),e.entries.forEach(function(e,n){var r=[];Object.keys(e).forEach(function(t){var o=e[t];i.includeFields[t]&&(0==n&&a.push(t),r.push(o))}),t.push(r.join(","))})),n(!1,[a.join(",")].concat(t).join("\n"))}});