export function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

 export function GetQueryString (name)
  {
      var after = window.location.hash.split("?")[1];
      if(after)
      {
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
          var r = after.match(reg);
         if(r != null)
         {
             return  decodeURIComponent(r[2]);
        }
        else
         {
            return null;
         }
     }
 }
export function UserInfo() {
	let userInfo = window.sessionStorage.getItem('userInfo');
	userInfo = userInfo ? JSON.parse(userInfo) : '';
	return userInfo;
}

