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

function showCourse(data,options)
{
	var courseList=document.getElementById('courseLoad');
	data.list.forEach(function(course)
	{
		courseList.appendChild(generateCourse(course));
	});

	createpagination(data.pagination,data.totalPage);

}

function createpagination(pagination,totalPage)
{

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
