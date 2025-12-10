document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    // 为每个图片添加点击事件
    galleryItems.forEach(img => {
        img.addEventListener('click', (e) => {
            lightbox.style.display = 'flex';
            lightboxImg.src = e.target.src; // 这里可以改为 e.target.dataset.fullsize 以加载更高清的图
            
            // 获取同级 div 下的 h3 文本作为标题
            const title = e.target.nextElementSibling.querySelector('h3').innerText;
            captionText.innerText = title;
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭功能
    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复滚动
    }

    closeBtn.addEventListener('click', closeLightbox);

    // 点击背景也能关闭
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            closeLightbox();
        }
    });
});