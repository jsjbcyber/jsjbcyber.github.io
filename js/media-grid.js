document.addEventListener('DOMContentLoaded', function() {
  const articleContent = document.querySelector('.markdown-body');
  if (!articleContent) return;

  // 获取所有段落元素
  const paragraphs = Array.from(articleContent.children);
  
  // 用于存储连续的媒体元素
  let consecutiveMedia = [];
  let lastMediaIndex = -1;

  // 遍历所有段落
  paragraphs.forEach((element, index) => {
    const isMediaParagraph = element.tagName === 'P' && 
      (element.querySelector('img') || element.querySelector('video')) ||
      element.tagName === 'IMG' || 
      element.tagName === 'VIDEO';

    if (isMediaParagraph) {
      if (lastMediaIndex === index - 1) {
        // 如果是连续的媒体元素
        consecutiveMedia.push(element);
      } else {
        // 如果不连续，先处理之前收集的连续媒体
        if (consecutiveMedia.length > 1) {
          createMediaGrid(consecutiveMedia);
        }
        // 开始新的收集
        consecutiveMedia = [element];
      }
      lastMediaIndex = index;
    } else {
      // 遇到非媒体元素，处理之前收集的连续媒体
      if (consecutiveMedia.length > 1) {
        createMediaGrid(consecutiveMedia);
      }
      consecutiveMedia = [];
      lastMediaIndex = -1;
    }
  });

  // 处理最后一组连续媒体
  if (consecutiveMedia.length > 1) {
    createMediaGrid(consecutiveMedia);
  }

  // 创建媒体网格的函数
  function createMediaGrid(elements) {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'media-grid-container';
    
    elements.forEach(element => {
      const wrapper = document.createElement('div');
      wrapper.className = 'media-item';
      
      if (element.tagName === 'P') {
        const media = element.querySelector('img, video');
        if (media) {
          wrapper.appendChild(media.cloneNode(true));
        }
      } else {
        wrapper.appendChild(element.cloneNode(true));
      }
      
      gridContainer.appendChild(wrapper);
    });

    // 插入网格并移除原始元素
    elements[0].parentNode.insertBefore(gridContainer, elements[0]);
    elements.forEach(element => element.remove());
  }
}); 