//ajax request
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
			// tabOptions.type=currentTab;

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
	html+='<div class="class-category">'+data.provider+'</div>';
	html+='<div class="class-numberOfStudent"><i class="sprites-icon-profile"></i><span>'+data.learnerCount+'</span></div>';
	html+='<div class="class-price">'+price+'</div>';
	html+='</div>';

	section.innerHTML=html;
	return section;
}

//tab button
function attachTabEvent()
{
	var total=arguments.length;
	for(var i=1;i<=total;i++)
	{
		function attachOne(i, el)
		{
			addEvent(el,'click',function(e)
			{
				 
				if(this.className=='courseTab')
				{
					tabOptions.type=10*i;
					tabOptions.pageNo=1;
					// currentTab=10*i;  //update currentTab
					get(urlCourseList,tabOptions,showCourse);
					this.className='courseTab current';
					if(i===1)
					{
						this.nextSibling.className='courseTab';
					}
					else
					{
						this.previousSibling.className='courseTab';
					}
				}
				
			});
		}
		attachOne (i,arguments[i-1]);        //闭包保存i



	}
}

// start of hot courses
function initHotCourse(data)  //
{
	var imgElements=document.querySelectorAll('#hotList img');
	var h3Elements=document.querySelectorAll('#hotList h3');
	var spanElements=document.querySelectorAll('#hotList span');
	for(var i=0; i<10; i++)
	{
		imgElements[i].setAttribute('src',data[i].smallPhotoUrl);
		h3Elements[i].textContent=data[i].name;
		spanElements[i].textContent=data[i].learnerCount;

	}
}

function showHotCourse(data)
{
	var elements=document.querySelectorAll('#hotList section'); //collect all section elements
	initHotCourse(data);

	var i=10;
	setInterval(function()
	{
		autoRenew(elements,i,data);
		i=i<data.length-1?i+1:0;
		elements=document.querySelectorAll('#hotList section'); //renew collection
	},5000);
}


function autoRenew(elements,i,data)  //更新函数，5秒更新
{
	var list=document.getElementById('hotList');
	var sectionNode=document.createElement('section');

	var html='';
	html+='<img src="'+data[i].smallPhotoUrl+'"';
	html+=' alt="thumbnail" width="50" height="50" />';
	html+='<h3>'+data[i].name+'</h3>';
	html+='<div><i class="sprites-icon-profile"></i>';
	html+='<span>'+data[i].learnerCount+'</span></div>';

	sectionNode.innerHTML=html;

	list.removeChild(elements[0]);
	list.appendChild(sectionNode);

}

//end of hot courses


//start of slidechange

function initSlide()
{
	var slide=document.getElementById('slide');
	var banners=document.querySelectorAll('.slide .banner');
	var buttons=document.querySelectorAll('.pointSet i');
	var currentImgIndex=0;
	var duration=5000;

	var repeatFunction= setInterval(oneTime,duration);

	function oneTime()
	{
		var toNum=(currentImgIndex==2)?0:currentImgIndex+1;
		changeImage(currentImgIndex,toNum,banners,buttons);
		banners[currentImgIndex].className='banner';
		banners[toNum].className='banner current';
		buttons[currentImgIndex].className='';
		buttons[toNum].className='current';

		currentImgIndex=toNum;
	}

	addEvent(slide,'mouseenter',function()
	{
		clearInterval(repeatFunction);
	});
	addEvent(slide,'mouseleave',function()
	{
		repeatFunction=setInterval(oneTime,duration);
	});
}


function changeImage(from,to,banners,buttons)
{
	// var buttons=document.querySelectorAll('.pointSet i');
	var fromImg=banners[from];
	var toImg=banners[to];
	var opacityCount=0;

	toImg.style.display='block';
	toImg.style.opacity=0;
	toImg.style.filter = 'alpha(opacity:0)';
	toImg.style.zIndex=3;
	

	var graduallyChange=setInterval(function()
	{
		if(opacityCount<10)
		{
			opacityCount+=2;
			toImg.style.opacity=opacityCount*0.1;
			toImg.style.filter = 'alpha(opacity:'+opacityCount*10+')';

		}

		else
		{
			clearInterval(graduallyChange);
			toImg.style.zIndex=2;
			fromImg.style.zIndex=1;
			fromImg.display='none';
		}
	},100);     //渐变函数
	// if(buttons[to].class!=='current')
	// {

	// }
}
//end of slidechange



var currentTab=10;
var tabOptions={
	pageNo: 1,
	psize:20,
	type:10
};




var urlCourseList='http://study.163.com/webDev/couresByCategory.htm';
var urlHotCourse='http://study.163.com/webDev/hotcouresByCategory.htm';
window.onload=function()
{
	var tabButton1=document.getElementById('tab1');
	var tabButton2=document.getElementById('tab2');
	// var tabButton=document.querySelectorAll('.courseTab');
	get(urlCourseList, tabOptions,showCourse);
	attachTabEvent(tabButton1,tabButton2);

	get(urlHotCourse,'', showHotCourse);
	initSlide();
};
