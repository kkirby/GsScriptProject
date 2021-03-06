var Handler = require('./Handler.js')

module.exports = (function(){
	function ImageHandler(){}
	ImageHandler.prototype = Object.create(Handler.prototype);
	ImageHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'image')return;
		var pathInfo = state.getFileInfo(file);
		if(!state.hasLoadedFile(file)){
			state.saveFile(file);
			state.loadableFiles.push(pathInfo.webUrl);
		}
		return {
			image: pathInfo,
			webUrl: pathInfo.webUrl,
			src: '\''+pathInfo.webUrl+'\''
		}
	};
	return ImageHandler;
})();