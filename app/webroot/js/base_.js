function str_repeat(i,m){
	for(var o=[];m>0;o[--m]=i);
	return(o.join(''));
}
function sprintf(){
	var i=0,f=arguments[i++],o=[],m,a,p;
	while(f){
		if(m=/^[^\x25]+/.exec(f))o.push(m[0]);
		else if(m=/^\x25{2}/.exec(f))o.push('%');
		else if(m=/^\x25(\+)?(0|'[^$])?(-)?(\d+)?(\.\d+)?([b-fosuxX])/.exec(f)){
			if(!(a=arguments[i++]))throw("Too few arguments.");
			if(/[^s]/.test(m[6])&&(typeof(a)!='number'))
				throw("Expecting number but found "+typeof(a));
			switch(m[6]){
				case'b':
					a=a.toString(2);
					break;
				case'c':
					a=String.fromCharCode(a);
					break;
				case'd':
					a=parseInt(a);
					break;
				case'e':
					a=m[5]?a.toExponential(m[5].charAt(1)):a.toExponential();
					break;
				case'f':
					a=m[5]?parseFloat(a).toFixed(m[5].charAt(1)):parseFloat(a);
					break;
				case'o':
					a=a.toString(8);
					break;
				case's':
					a=((a=String(a))&&m[5]?a.substring(0,m[5].charAt(1)):a);
					break;
				case'u':
					a=Math.abs(a);
					break;
				case'x':
					a=a.toString(16);
					break;
				case'X':
					a=a.toString(16).toUpperCase();
					break;
			}
			a=(/[def]/.test(m[6])&&m[1]&&a>0?'+'+a:a);
			p=m[4]?str_repeat(m[2]?m[2]=='0'?'0':m[2].charAt(1):' ',m[5]?m[4]-String(a).length:m[4]):'';
			o.push(m[3]?a+p:p+a);
		}else throw("Huh ?");
		f=f.substring(m[0].length);
	}
	return(o.join(''));
}