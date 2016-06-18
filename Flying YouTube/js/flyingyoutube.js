var FlyingYouTube = 
{
	checkInterval: 500,

	onContentLoaded: function() 
	{
		var doc = document;

		if (this.injectHTML(doc))
		{
			doc.defaultView.setTimeout(this.checkSiteChange.bind(this, doc), this.checkInterval);
		}
	},

	checkSiteChange: function(doc)
	{
		if (this.injectHTML(doc))
		{
			doc.defaultView.setTimeout(this.checkSiteChange.bind(this, doc), this.checkInterval);
		}
	},

	injectHTML: function(doc)
	{
		if (!doc || !doc.location || !doc.defaultView || doc.defaultView.closed)
		{
			return false;
		}

		var loc = doc.location;

		if (!loc.href.match(/^https?:\/\/([a-z]{2,3}\.)?youtube\.com/i))
		{
			return false;
		}

		if (loc.href.match(/^https?:\/\/([a-z]{2,3}\.)?youtube\.com\/watch\?/i))
		{
			var div = null;

			if (doc.getElementById("flyingyoutube-dl-link"))
			{
				return true;
			}

			var href = loc.toString();
			var url = "http://www.ssyoutube.com/watch" + href.substr(href.indexOf("?"));

			if(div = doc.getElementById("watch-this-vid-info"))
			{
				div.innerHTML = '<div id="flyingyoutube-dl-link" style="font-size:11px;font-weight:bold;padding-top:3px;padding-right:5px"><a href="'+url+'" class="hLink" target="_blank" id="yt-dl-link">Download Video</a></div>'+div.innerHTML;
			}
			else if(div = doc.getElementById('watch-panel'))
			{
				div.innerHTML = '<div id="flyingyoutube-dl-link"  style="font-size:11px;font-weight:bold;margin-top:-6px;padding-right:5px;padding-bottom:6px"><a href="'+url+'" class="hLink" target="_blank" id="yt-dl-link">Download Video</a></div>'+div.innerHTML;
			}
			else if(div = doc.getElementById('watch7-headline'))
			{
				div.innerHTML = '<div id="flyingyoutube-dl-link"  style="margin-top:-4px;font-weight:bold;float:right"><a href="'+url+'" target="_blank">Download Video</a></div>'+div.innerHTML;
			}
			else
			{
				divs = doc.getElementsByClassName('watch-panel-divided-bottom');
				if(divs && divs.length)
				{
					divs[0].innerHTML = '<div id="flyingyoutube-dl-link"  style="margin-top:-6px;float:right"><a href="'+url+'" target="_blank">Download Video</a></div>'+divs[0].innerHTML;
				}
			}
		}

		return true;
	}
};

FlyingYouTube.onContentLoaded();
