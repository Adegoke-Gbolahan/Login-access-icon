 function telegram_share(music_url,music_name,music_category)
 {
     var url = " https://xlrsounds.com/music/" + music_url;
     var shareSound = music_name;
    var text = "Vist " + url  +" to play " + music_name + " - xlrsounds " + music_category +" Effect Button " + " | Xlrsounds The largest sound buttons website!";
   
     
     window.open("https://t.me/share/url?text="+ text +"&url="+ url);
  
  }
  
     function whatsapp_share(music_url,music_name,music_category)
 {
     var url = " https://xlrsounds.com/music/" + music_url;
     var shareSound = music_name;
     var text = "Vist " + url  +" to play " + music_name + " - xlrsounds " + music_category +" Effect Button " + " | Xlrsounds The largest sound buttons website!";
      
     window.open("https://api.whatsapp.com/send?text="+ text + url);
  }
  
  
  function twitter_share(music_url,music_name,music_category)
 {
     
     var url = "https://xlrsounds.com/music/" + music_url;
     var shareSound = music_name;
     var text = "Vist " + url  +" to play " + music_name + " - xlrsounds " + music_category +" Effect Button " + " | Xlrsounds The largest sound buttons website!";
     var hashtags = "xlrsounds";
     var via = "soundboard, xlrsounds, xlr sounds, sounds, xlr, sound xlr,XLRSOUNDS, xlr buttons xlr button,instant button, instant buttons, funny sounds, funny gifs, internet memes,";
     var related = "xlrsounds";
      
     window.open("https://twitter.com/intent/tweet?text="+ text +"&url="+ url +"&hashtags="+ hashtags + "&via="+ via + "&related="+ related);
     
 }     
 
    function facebook_share(music_url,music_name,music_category)
 {
     var url = "https://xlrsounds.com/music/" + music_url;
     var shareSound = music_name;
    var text = "Vist " + url  +" to play " + music_name + " - xlrsounds " + music_category +" Effect Button " + " | Xlrsounds The largest sound buttons website!";


	 window.open("https://www.facebook.com/sharer/sharer?u="+ url + "&quote="+ text);
 }
     