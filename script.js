import overallData from './overall.json' assert {type: 'json'};
import wordCountData from './wordCount.json' assert {type: 'json'};
import messagesByMonth from './messagesByMonth.json' assert {type: 'json'};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function setWordCountPerson(id){
	document.getElementById('wordCloud').innerHTML = ''
	const data = wordCountData[id]
	const chart = anychart.tagCloud(data.words.map(el=>({x:el.word, value:el.count})));
	chart.title(data.name+' word cloud')
	chart.mode("spiral");
	chart.container("wordCloud");
	chart.draw();
}

function generateTabs(root){
	
	wordCountData.forEach((el, ind)=>{
		const temp = document.createElement('button')
		temp.classList.add('tablinks')
		temp.addEventListener('click', function (ev){
			setWordCountPerson(ind)
		})
		temp.innerText = el.name
		root.appendChild(temp)
	})
}

anychart.onDocumentLoad(function () {
	const overallChart = anychart.pie();
	overallChart.data(overallData)	
	overallChart.title("Overall messages"); 
	overallChart.container("overallMessages");
	overallChart.draw();

	generateTabs(document.getElementById('wordCountTab'))
	setWordCountPerson(0)

	  const data = []
	  
	  Object.keys(messagesByMonth).forEach(el=>{
		let out = []
		Object.entries(messagesByMonth[el]).forEach(([year, month])=>{
			Object.entries(month).forEach(([month, msgs])=>{
				out.push([`${year} ${monthNames[+month]}`, msgs.length])
			})
		  })
		data.push(out)
	  })
	  

	  let chart = anychart.line();
	  
	  data.forEach((el, ind)=>{
		const line = chart.line(el)
		line.name(Object.keys(messagesByMonth)[ind])
		line.hovered().markers().enabled(true).type('circle').size(4);
		line
        .tooltip()
        .position('right')
        .anchor('left-center')
        .offsetX(5)
        .offsetY(5);
	})
	  chart.legend().enabled(true).fontSize(13).padding([0, 0, 10, 0]);
	  chart.container("countByMonth");
	  
	  chart.draw();
});
