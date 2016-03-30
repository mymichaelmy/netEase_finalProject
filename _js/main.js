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

/*  utility   */
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

//setCookie
function setCookie(name,value,path,domain,secure,expire)
{
	var cookie=encodeURIComponent(name)+'='+encodeURIComponent(value);

	if(expire)
	{
		cookie+='; expires='+expires.toGMTString();
	}

	if(path)
	{
		cookie+='; path='+path;

	}
	if(domain)
	{
		cookie+='; domain='+domain;

	}
	if(secure)
	{
		cookie+='; secure='+secure;
	}

	document.cookie=cookie;
}

function getCookie(name)
{
	var namestring=name+'=';

	var arreyOfCookie=document.cookie.split(';');
	for(var i=0;i<arreyOfCookie.length;i++)
	{
		while(arreyOfCookie[i].charAt(0)==' ')
		{
			arreyOfCookie[i]=arreyOfCookie[i].substring(1);
		}

		if(arreyOfCookie[i].indexOf(namestring)===0)
		{
			console.log(arreyOfCookie[i].substring(namestring.length,arreyOfCookie[i].length));
			return arreyOfCookie[i].substring(namestring.length,arreyOfCookie[i].length);
		}

		
	}
	return '';
}

/* end of utility*/

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
			tabOptions.pageNo=this.textContent;
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
	html+='<a href=""><img src="'+data.middlePhotoUrl+'"';
	html+=' alt="" width="223" height="124" /></a>';
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

	function updateButtonAndBanner(from,to) //更新current
	{
		banners[from].className='banner';
		banners[to].className='banner current';
		buttons[from].className='';
		buttons[to].className='current';
	}
	function oneTime()
	{
		var toNum=(currentImgIndex==2)?0:currentImgIndex+1;
		changeImage(currentImgIndex,toNum,banners);
		updateButtonAndBanner(currentImgIndex,toNum);

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

	//attach button event
	for(var i=0;i<buttons.length;i++)
	{
		function attachOneButton(i,button)
		{
			addEvent(button,'click',function(e)
			{
				var toNum=i;
				if(button.className!=='current')
				{
					clearInterval(repeatFunction);
			
					changeImage(currentImgIndex,toNum,banners);
					updateButtonAndBanner(currentImgIndex,toNum);
					currentImgIndex=toNum;
				}
			});

		}
		attachOneButton(i,buttons[i]);    //闭包
	}
	
}


function changeImage(from,to,banners)
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

//start if notification
function notificationBarInit()
{
	var cookie=getCookie('noNotification');
	var reminder=document.getElementById('reminder');
	if(cookie=='true')
	{
		
		reminder.style.display='none';
	}

	var cross=document.getElementById('reminderCross');
	addEvent(cross,'click',function(e)
	{
		setCookie('noNotification',true,'/','');
		reminder.style.display='none';
	});
}
//end of notification

function initFollow()
{
	var followButton=document.getElementById('followButton');
	var cancelFollow=followButton.querySelector('a');

	var followCookie=getCookie('followSuc');
	var loginCookie=getCookie('loginSuc');


	if(followCookie=='true'&&loginCookie=='true')
	{
		followButton.className='followed';
	}
	addEvent(followButton,'click',function(e)
	{
		if(this.className=='toFollow')
		{
			

			if(!loginCookie)
			{
				initLogin();
			}

			else
			{
				toFollow(followButton);
			}
		}

		else
		{
			followButton.className='toFollow'; // //用于在取消关注后撤销
		}
		
	});

	addEvent(cancelFollow,'click',function(e)
	{
		preventDefault(e);
		setCookie('followSuc',false,'/','');
		// followButton.className='toFollow'; 
		// 此处不修改class, 因为button的click也会触发，在button内判断之后修改
		// 
	});
}

function toFollow(button)
{
	button.className='followed';
	setCookie('followSuc',true,'/','');
}

//初始化登录
function initLogin()
{
	var loginWrapper=document.getElementById('loginWrapper');
	var quit=loginWrapper.querySelector('i');
	var submit=document.getElementById('submit1');
	var form=document.getElementById('login');
	var loginUrl='http://study.163.com/webDev/login.htm';

	loginWrapper.style.display='block';

	addEvent(quit,'click',function(e)
	{
		loginWrapper.style.display='none';
	});

	addEvent(login,'submit',function(e)
	{
		preventDefault(e);
		var username=form.elements.username;
		var password=form.elements.password;

		options={userName:md5(username.value),password:md5(password.value)};

		get(loginUrl, options, function(data,options)
		{
			if(data===1)
			{
				loginWrapper.style.display='none';
				setCookie('loginSuc',true,'/','');

				var followUrl='http://study.163.com/webDev/attention.htm';
				get(followUrl,'',function(data)
				{
					if(data)
					{
						console.log('hasFollowed');
						var followButton=document.getElementById('followButton');
						toFollow(followButton);
					}
				});
			}
			else
			{
				var alert=document.getElementById('alert');
				alert.style.display='block';
			}
		});
	});
}

//阻止默认事件
function preventDefault(e)
{
	if(e.preventDefault)
	{
		e.preventDefault();
	}
	else
	{
		e.returnValue=false;
	}
}

//init video
function initVideo()
{
	var videoWrapper=document.getElementById('videoWrapper');
	var quit=videoWrapper.querySelector('i');
	var link=document.querySelector('.aside-intro a');
	var video=videoWrapper.querySelector('video');

	

	addEvent(quit,'click',function(e)
	{
		videoWrapper.style.display='none';
	});

	addEvent(link,'click',function(e)
	{
		preventDefault(e);
		video.setAttribute('src',videoLink);
		videoWrapper.style.display='block';
	});
}

var currentTab=10;
var tabOptions={
	pageNo: 1,
	psize:20,
	type:10
};




var urlCourseList='http://study.163.com/webDev/couresByCategory.htm';
var urlHotCourse='http://study.163.com/webDev/hotcouresByCategory.htm';
var videoLink='http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4';
window.onload=function()
{
	var tabButton1=document.getElementById('tab1');
	var tabButton2=document.getElementById('tab2');
	// var tabButton=document.querySelectorAll('.courseTab');
	get(urlCourseList, tabOptions,showCourse);
	attachTabEvent(tabButton1,tabButton2);

	get(urlHotCourse,'', showHotCourse);
	initSlide();
	notificationBarInit(); //通知条
	initFollow();//启动关注功能
	initVideo();//初始化视频
};
