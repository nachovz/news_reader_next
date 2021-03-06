import ReactHtmlParser from 'react-html-parser';
import AdUnit from 'component/ui/AdUnit';

const tagCleaner = (ren, type='title', lazyLoaded=false) => {

	var clean = ren.replace(/style="text-align: justify;"/g, '')
      .replace(/&#171;/g, '“<em>')
      .replace(/&#187;/g,'</em>”')
      .replace(/<p><iframe/g,'<iframe')
      .replace(/\/iframe><\/p>/g,'/iframe>')
      .replace(/width="[0-9]*"/g, `width="100%"`)
      .replace(/height="[0-9]*"/g, `height="250px"`)
      .replace(/style="width: [0-9]*px"/g, `style="width:100%"`)
      .replace(/src/g,`data-src`)
      .replace(/srcset/g,`data-srcset`)
      .replace(/http:\/\/www.elnacional.com/g, `https://www.elnacional.com`)
      .replace(/<blockquote/g,`<div class="wrapped-content"><blockquote`)
      .replace(/<\/blockquote>/g,`</blockquote></div>`)
      .replace(/<a href="https:\/\/www.elnacional.com/g, '<a href="')
      .replace(/style="color: rgb(0, 204, 255);"/g, '')
      .replace(/style="color:#00ccff"/g, '')

	if( type === 'excerpt') clean = clean.substring(0, clean.indexOf(". ") > 50 ? clean.indexOf(". ") : clean.indexOf(". ", clean.indexOf(". "))) + "&hellip;"

  const parsed = ReactHtmlParser(clean);
  
  if(type==='title' || type === 'excerpt') return parsed;

  let withAds = [];
  let paragraphs = 1;
  parsed.forEach( (node, ind) => {
    const inset = paragraphs % 4 === 0 || paragraphs === 2;
    const top = !!node.type.match(/h2|iframe|h3|h4|h5|h6/);
    if(node.type === 'p'){
      if(top && inset){
        withAds.push(<AdUnit 
          key={`ad_${ind}`} 
          unitId={`gtp-en${Date.now()}-${ind}`} 
          lazyLoaded={lazyLoaded}/>
        )
      }
      withAds.push(node);
      if(!top && inset) {
        withAds.push(<AdUnit 
          key={`ad_${ind}`} 
          unitId={`gtp-en${Date.now()}-${ind}`} 
          lazyLoaded={lazyLoaded}/>)
      }
      paragraphs++;
    }else{
      withAds.push(node);
    }
  })

  return withAds;
}

export default tagCleaner;