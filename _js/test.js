var name = "The Window";   

function a()
{
	var name = "function a";
	function b()
	{
		alert(name);
	}
	return b;
}

var c=a();
c();

var object = {   
　　　　name : "My Object",   
　　　　getNameFunc : function(){   
　　　　　　return function(){   
　　　　　　　　return this.name;   
　　　　　};   
　　　　}   
}; 

// alert(object.getNameFunc()()); 