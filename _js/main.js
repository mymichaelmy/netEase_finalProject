function get(url, options, callback)
{
	var optionsArrey=[];

	for (var name in options)
	{
		var value= options[name];
		name=encodeURIComponent(name);
		value=encodeURIComponent(value);
		optionsArrey.push(name+'='+value);
	}

	optionsArrey=optionsArrey.join('&');
	var xhr=new XMLHttpRequest();
	xhr.onload=function()
	{
		var status=xhr.status;
		if((status>=200&&status<300)||status==304)
		{
			console.log('success!');
			var responseObject=JSON.parse(xhr.responseText);
			if(typeof(callback)=='function')
			{
				callback(responseObject, options);
			}
		}
		else
		{
			console.log('errors');
			return '';
		}
	};

	xhr.open('get',url+'?'+optionsArrey,true);
	xhr.send(null);

}

// functionalities
function min(num1, num2)
{
	if(num1<num2)
	{
		return num1;
	}

	else
	{
		return num2;
	}
}

//addEvent helper function
function addEvent(el,event,callback)
{
	if('addEventListener' in el)
	{
		el.addEventListener(event, callback, false);
	}
	else
	{
		el['e'+event+callback]=callback;
		el[event+callback]=function()
		{
			el['e'+event+callback](window.event);
		};
		el.attachEvent('on'+event,el[event+callback]);
	}
}


function createpagination(options,totalPage)
{

	var pageFlip=document.getElementById('pageFlip');
	var numberOfButton=min(8,totalPage);    //页码按键数
	var currentPage=parseInt(options.pageNo,10);    //当前页数
	var buttonleft=document.createElement('button');

    //左翻页
	buttonleft.innerHTML='<i id="leftArrow" class="sprites-icon-left"></i>';
	buttonleft.setAttribute('class', 'flip');
	buttonleft.id='left';
	pageFlip.appendChild(buttonleft);


	var startPage=1;//设定最左端页码按钮
	if(currentPage>=5&&currentPage<=totalPage-3)
	{
		startPage=currentPage-4;

	}

	else if(currentPage<5)
	{
		startPage=1;
	}

	else
	{
		startPage=totalPage-7;
	}

	for(var i=startPage;i<=startPage+numberOfButton-1;i++)
	{
		var buttonElement=document.createElement('button');
		buttonElement.textContent=i;
		if(i===currentPage)
		{
			buttonElement.className='current';
		}

		addEvent(buttonElement,'click',function(e)
		{
			tabOptions.pageNo=e.target.textContent;
			tabOptions.type=currentTab;

			get(urlCourseList, tabOptions,showCourse);
		});

		pageFlip.appendChild(buttonElement);
	}

	//右翻页
	var buttonright=document.createElement('button');

	buttonright.innerHTML='<i id="rightArrow" class="sprites-icon-right"></i>';
	buttonright.setAttribute('class', 'flip');
	buttonright.id='right';
	pageFlip.appendChild(buttonright);
}

function showCourse(data,options)
{
	var courseLoad=document.getElementById('courseLoad');
	var pageFlip=document.getElementById('pageFlip');

	courseLoad.innerHTML='';
	pageFlip.innerHTML='';
	//每次ajax清除课表和按键内容
	//
	data.list.forEach(function(course)
	{
		courseLoad.appendChild(generateCourse(course));
	});

	createpagination(options,data.totalPage);

}

function generateCourse(data)
{
	var price='';
	if(data.price=='0')
	{
		price='免费';
	}
	else
	{
		price='¥ '+data.price;
	}

	var section=document.createElement('section');
	var html='';
	html+='<img src="'+data.middlePhotoUrl+'"';
	html+=' alt="" width="223" height="124" />';
	html+='<div class="class-textWrapper">';
	html+='<h2>'+data.name+'</h2>';
	html+='<div class="class-category">'+data.categoryName+'</div>';
	html+='<div class="class-numberOfStudent"><i class="sprites-icon-profile"></i><span>'+data.learnerCount+'</span></div>';
	html+='<div class="class-price">'+price+'</div>';
	html+='</div>';

	section.innerHTML=html;
	return section;
}

var currentTab=10;
var tabOptions={
	pageNo: 1,
	psize:20,
	type:10
};

var urlCourseList='http://study.163.com/webDev/couresByCategory.htm';
window.onload=function()
{

	get(urlCourseList, tabOptions,showCourse);
};
