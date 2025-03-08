document.addEventListener('DOMContentLoaded', function() {
    // 视频卡片点击处理
    setupVideoCards();
    
    // 搜索功能
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    function performSearch(query) {
        if (query.trim() === '') {
            alert('请输入搜索内容');
            return;
        }
        
        // 存储搜索词并跳转到搜索结果页面
        sessionStorage.setItem('searchQuery', query);
        window.location.href = 'search-results.html?q=' + encodeURIComponent(query);
    }
    
    // 为文章卡片添加点击事件
    const postCards = document.querySelectorAll('.post-card');
    const postLinks = document.querySelectorAll('.post-card .post-header h3 a');
    
    // 确保只有点击文章标题链接时才跳转，整个卡片不跳转
    postLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡到卡片
        });
    });
    
    // 添加卡片的点击效果 - 只有点击不是链接的区域才触发
    postCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的是链接或者链接的子元素，不执行任何操作
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            // 否则，查找这个卡片中的链接并模拟点击
            const link = this.querySelector('.post-header h3 a');
            if (link) {
                link.click();
            }
        });
    });
    
    // 显示随机"推荐"文章的模拟功能
    function getRandomArticles() {
        const articles = [
            { 
                title: '鹿关的日落美景', 
                views: '7.3千', 
                likes: '96%',
                summary: '在鹿关观看日落是一种难以形容的体验，金色的阳光洒在山谷中，鹿群在夕阳下漫步...',
                duration: '7分钟阅读',
                imageSrc: 'img/OIP (1).jpg'
            },
            { 
                title: '鹿关观光指南', 
                views: '5.1千', 
                likes: '93%',
                summary: '如何规划一次完美的鹿关之旅？从交通、住宿到景点，这篇指南为你提供全方位建议...',
                duration: '9分钟阅读',
                imageSrc: 'img/OIP (2).jpg'
            },
            { 
                title: '鹿关摄影作品集', 
                views: '9.8千', 
                likes: '98%',
                summary: '收集了我过去三年在鹿关拍摄的精选照片，记录下四季变换和珍贵的野生动物瞬间...',
                duration: '4分钟阅读',
                imageSrc: 'img/OIP (3).jpg'
            },
            { 
                title: '我与鹿关的故事', 
                views: '6.2千', 
                likes: '95%',
                summary: '第一次邂逅鹿关是十年前的夏天，从此这个地方就成了我心灵的栖息地...',
                duration: '11分钟阅读',
                imageSrc: 'img/OIP (4).jpg'
            },
            { 
                title: '鹿关的传说与历史', 
                views: '4.5千', 
                likes: '92%',
                summary: '鹿关不仅有美丽的自然风光，还有丰富的历史和有趣的民间传说...',
                duration: '8分钟阅读',
                imageSrc: 'img/OIP (5).jpg'
            }
        ];
        
        // 随机选择两篇文章显示在页面上
        return articles.sort(() => 0.5 - Math.random()).slice(0, 2);
    }
    
    // 热门分类数据
    const categories = [
        { name: "鹿关爱好", isHot: true },
        { name: "摄影作品", isHot: true },
        { name: "旅行日记", isHot: false },
        { name: "美食推荐", isHot: true },
        { name: "生活随笔", isHot: false },
        { name: "户外探险", isHot: false }
    ];
    
    // 添加热门标签功能
    function addHotBadges() {
        const categoryItems = document.querySelectorAll('.category-item');
        if (categoryItems.length === 0) return;
        
        // 遍历分类项，根据数据添加热门标签
        categoryItems.forEach((item, index) => {
            if (index < categories.length && categories[index].isHot) {
                const hotBadge = document.createElement('span');
                hotBadge.textContent = '热门';
                hotBadge.className = 'hot-badge';
                
                item.style.position = 'relative';
                item.appendChild(hotBadge);
            }
        });
        
        // 为分类项添加点击事件
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                const categoryName = this.querySelector('span:not(.hot-badge)').textContent;
                sessionStorage.setItem('selectedCategory', categoryName);
                window.location.href = 'articles.html?category=' + encodeURIComponent(categoryName);
            });
        });
    }
    
    // 添加简单的加载更多文章功能
    function setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', function() {
            // 模拟加载
            this.textContent = '加载中...';
            this.disabled = true;
            
            setTimeout(() => {
                const randomArticles = getRandomArticles();
                const postGrid = document.querySelector('.recent .post-grid');
                
                if (postGrid) {
                    randomArticles.forEach(article => {
                        const articleElement = createArticleElement(article);
                        postGrid.appendChild(articleElement);
                    });
                }
                
                this.textContent = '加载更多';
                this.disabled = false;
                
                // 如果已经加载了足够多的文章，隐藏按钮
                const currentArticleCount = document.querySelectorAll('.recent .post-card').length;
                if (currentArticleCount >= 8) {
                    this.style.display = 'none';
                    
                    // 添加一个"没有更多文章"的提示
                    const noMoreText = document.createElement('p');
                    noMoreText.textContent = '没有更多文章了';
                    noMoreText.style.textAlign = 'center';
                    noMoreText.style.color = '#999';
                    noMoreText.style.margin = '20px 0';
                    
                    this.parentNode.appendChild(noMoreText);
                }
            }, 1500);
        });
    }
    
    function createArticleElement(article) {
        const articleElement = document.createElement('article');
        articleElement.className = 'post-card';
        
        articleElement.innerHTML = `
            <div class="post-info">
                <div class="post-header">
                    <h3><a href="#">${article.title}</a></h3>
                    <span class="duration">${article.duration}</span>
                </div>
                <p class="post-summary">${article.summary}</p>
                <div class="post-meta">
                    <span class="views">${article.views} 浏览</span>
                    <span class="likes">${article.likes}</span>
                </div>
                <p class="author">作者: 王导鸡</p>
            </div>
        `;
        
        // 添加点击事件
        const link = articleElement.querySelector('.post-header h3 a');
        
        articleElement.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            if (link) {
                link.click();
            }
        });
        
        return articleElement;
    }
    
    // 添加返回顶部按钮
    function addBackToTopButton() {
        // 创建返回顶部按钮
        const backToTopButton = document.createElement('div');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '↑';
        document.body.appendChild(backToTopButton);
        
        // 添加点击事件
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 滚动时显示/隐藏按钮
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
    
    // 为文章页面添加分享按钮
    function addShareButtons() {
        // 检查是否在文章页面
        const articleContainer = document.querySelector('.article-container');
        if (!articleContainer) return;
        
        // 获取文章标题和当前URL
        const articleTitle = document.querySelector('.article-title').textContent;
        const currentUrl = window.location.href;
        
        // 创建分享按钮容器
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-buttons';
        
        // 添加分享到微信按钮
        const wechatButton = document.createElement('div');
        wechatButton.className = 'share-button';
        wechatButton.innerHTML = '<span>微信</span>';
        wechatButton.addEventListener('click', function() {
            alert('请截图并分享给微信好友或朋友圈');
        });
        
        // 添加分享到微博按钮
        const weiboButton = document.createElement('div');
        weiboButton.className = 'share-button';
        weiboButton.innerHTML = '<span>微博</span>';
        weiboButton.addEventListener('click', function() {
            const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(articleTitle)}`;
            window.open(weiboUrl, '_blank');
        });
        
        // 添加分享到QQ空间按钮
        const qzoneButton = document.createElement('div');
        qzoneButton.className = 'share-button';
        qzoneButton.innerHTML = '<span>QQ空间</span>';
        qzoneButton.addEventListener('click', function() {
            const qzoneUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent('来自王导鸡的博客')}`;
            window.open(qzoneUrl, '_blank');
        });
        
        // 添加复制链接按钮
        const copyButton = document.createElement('div');
        copyButton.className = 'share-button';
        copyButton.innerHTML = '<span>复制链接</span>';
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(currentUrl).then(function() {
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<span>已复制!</span>';
                setTimeout(function() {
                    copyButton.innerHTML = originalText;
                }, 2000);
            });
        });
        
        // 将按钮添加到容器
        shareContainer.appendChild(wechatButton);
        shareContainer.appendChild(weiboButton);
        shareContainer.appendChild(qzoneButton);
        shareContainer.appendChild(copyButton);
        
        // 将容器添加到文章元数据后面
        const articleMeta = document.querySelector('.article-meta');
        articleMeta.parentNode.insertBefore(shareContainer, articleMeta.nextSibling);
    }
    
    // 增强搜索功能
    function enhanceSearch() {
        const searchInput = document.querySelector('.search-container input');
        if (!searchInput) return;
        
        // 创建更高级的搜索UI
        const searchContainer = document.querySelector('.search-container');
        
        // 移除搜索图标
        const existingSearchIcon = document.querySelector('.search-icon');
        if (existingSearchIcon) {
            existingSearchIcon.remove();
        }
        
        // 添加搜索历史和热门搜索
        const searchExtension = document.createElement('div');
        searchExtension.className = 'search-extension';
        searchExtension.style.display = 'none';
        
        // 添加热门搜索
        const hotSearches = document.createElement('div');
        hotSearches.className = 'hot-searches';
        hotSearches.innerHTML = '<h4>热门搜索</h4>';
        
        const hotTags = [
            '鹿关风景', '摄影技巧', '野生动物', '旅游指南', '美食推荐'
        ];
        
        const hotTagsContainer = document.createElement('div');
        hotTagsContainer.className = 'hot-tags';
        
        hotTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'hot-tag';
            tagElement.textContent = tag;
            tagElement.addEventListener('click', function() {
                searchInput.value = tag;
                performSearch(tag);
            });
            hotTagsContainer.appendChild(tagElement);
        });
        
        hotSearches.appendChild(hotTagsContainer);
        
        // 添加搜索历史
        const searchHistory = document.createElement('div');
        searchHistory.className = 'search-history';
        searchHistory.innerHTML = '<h4>搜索历史 <span class="clear-history">清除</span></h4>';
        
        // 获取搜索历史
        const historyList = document.createElement('ul');
        historyList.className = 'history-list';
        
        // 从localStorage获取搜索历史
        let histories = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        // 显示最近5条搜索历史
        histories.slice(0, 5).forEach(item => {
            const historyItem = document.createElement('li');
            historyItem.innerHTML = `
                <span class="history-time">${new Date(item.time).toLocaleDateString()}</span>
                <span class="history-query">${item.query}</span>
                <span class="history-delete" data-query="${item.query}">×</span>
            `;
            historyItem.querySelector('.history-query').addEventListener('click', function() {
                searchInput.value = item.query;
                performSearch(item.query);
            });
            historyItem.querySelector('.history-delete').addEventListener('click', function(e) {
                e.stopPropagation();
                const query = this.getAttribute('data-query');
                removeFromHistory(query);
                historyItem.remove();
            });
            historyList.appendChild(historyItem);
        });
        
        searchHistory.appendChild(historyList);
        
        // 清除所有历史记录
        searchHistory.querySelector('.clear-history').addEventListener('click', function() {
            localStorage.removeItem('searchHistory');
            historyList.innerHTML = '';
        });
        
        // 组装搜索扩展面板
        searchExtension.appendChild(hotSearches);
        searchExtension.appendChild(searchHistory);
        searchContainer.appendChild(searchExtension);
        
        // 添加自动完成建议功能
        const searchSuggestions = [
            '鹿关自然保护区',
            '鹿关摄影技巧',
            '鹿关美食推荐',
            '鹿关旅游指南',
            '鹿关最佳季节',
            '鹿关野生动物',
            '鹿关摄影作品',
            '鹿关住宿推荐',
            '鹿关交通指南',
            '鹿关历史文化'
        ];
        
        // 创建自动完成容器
        const autocompleteContainer = document.createElement('div');
        autocompleteContainer.className = 'autocomplete-container';
        autocompleteContainer.style.display = 'none';
        searchContainer.appendChild(autocompleteContainer);
        
        // 监听输入事件
        searchInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            autocompleteContainer.innerHTML = '';
            
            // 隐藏搜索扩展面板
            searchExtension.style.display = 'none';
            
            if (inputValue.length < 1) {
                autocompleteContainer.style.display = 'none';
                return;
            }
            
            // 过滤匹配的建议
            const matchedSuggestions = searchSuggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(inputValue)
            );
            
            if (matchedSuggestions.length === 0) {
                autocompleteContainer.style.display = 'none';
                return;
            }
            
            // 显示匹配的建议
            matchedSuggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                
                // 高亮匹配部分
                const regex = new RegExp(`(${inputValue})`, 'gi');
                const highlightedText = suggestion.replace(regex, '<span class="highlight">$1</span>');
                
                suggestionItem.innerHTML = highlightedText;
                
                suggestionItem.addEventListener('mouseenter', function() {
                    this.classList.add('active');
                });
                
                suggestionItem.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                });
                
                suggestionItem.addEventListener('click', function() {
                    searchInput.value = suggestion;
                    autocompleteContainer.style.display = 'none';
                    performSearch(suggestion);
                });
                
                autocompleteContainer.appendChild(suggestionItem);
            });
            
            autocompleteContainer.style.display = 'block';
        });
        
        // 显示搜索扩展面板
        searchInput.addEventListener('focus', function() {
            if (this.value.length === 0) {
                searchExtension.style.display = 'block';
                autocompleteContainer.style.display = 'none';
            } else {
                searchExtension.style.display = 'none';
                // 触发input事件以显示自动完成
                const event = new Event('input');
                this.dispatchEvent(event);
            }
        });
        
        // 点击页面其他区域时隐藏自动完成和搜索扩展
        document.addEventListener('click', function(event) {
            if (!searchContainer.contains(event.target)) {
                autocompleteContainer.style.display = 'none';
                searchExtension.style.display = 'none';
            }
        });
        
        // 添加键盘导航功能
        searchInput.addEventListener('keydown', function(e) {
            // 如果自动完成容器不可见，则不处理
            if (autocompleteContainer.style.display === 'none') return;
            
            const items = autocompleteContainer.querySelectorAll('div');
            if (items.length === 0) return;
            
            // 查找当前选中的项
            const activeItem = autocompleteContainer.querySelector('.active');
            let activeIndex = -1;
            
            if (activeItem) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i] === activeItem) {
                        activeIndex = i;
                        break;
                    }
                }
            }
            
            // 向下箭头
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                updateActiveItem(items, activeIndex);
            }
            // 向上箭头
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                updateActiveItem(items, activeIndex);
            }
            // 回车键
            else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex !== -1) {
                    items[activeIndex].click();
                } else if (items.length > 0) {
                    items[0].click();
                } else {
                    performSearch(searchInput.value);
                }
            }
        });
        
        // 更新选中的项
        function updateActiveItem(items, activeIndex) {
            items.forEach(item => item.classList.remove('active'));
            items[activeIndex].classList.add('active');
            items[activeIndex].scrollIntoView({ block: 'nearest' });
        }
        
        // 修改搜索执行函数，添加历史记录功能
        window.performSearch = function(query) {
            if (query.trim() === '') {
                alert('请输入搜索内容');
                return;
            }
            
            // 保存到搜索历史
            saveToHistory(query);
            
            // 存储搜索词并跳转到搜索结果页面
            sessionStorage.setItem('searchQuery', query);
            window.location.href = 'search-results.html?q=' + encodeURIComponent(query);
        };
        
        // 保存搜索历史到localStorage
        function saveToHistory(query) {
            let histories = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            
            // 检查是否已存在相同查询，如果有则删除
            histories = histories.filter(item => item.query !== query);
            
            // 添加新的搜索历史
            histories.unshift({
                query: query,
                time: Date.now()
            });
            
            // 最多保存20条搜索历史
            if (histories.length > 20) {
                histories = histories.slice(0, 20);
            }
            
            localStorage.setItem('searchHistory', JSON.stringify(histories));
        }
        
        // 从历史中删除指定项
        function removeFromHistory(query) {
            let histories = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            histories = histories.filter(item => item.query !== query);
            localStorage.setItem('searchHistory', JSON.stringify(histories));
        }
        
        // 修改原有的搜索按钮事件
        const searchButton = document.querySelector('.search-container button');
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                performSearch(searchInput.value);
            });
        }
        
        // 监听回车键
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && autocompleteContainer.style.display === 'none') {
                performSearch(this.value);
            }
        });
    }
    
    // 添加文章阅读进度条
    function addReadingProgress() {
        // 检查是否在文章页面
        const articleContainer = document.querySelector('.article-container');
        if (!articleContainer) return;
        
        // 创建进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        
        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        
        // 添加到容器
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        // 监听滚动事件更新进度条
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.clientHeight - windowHeight;
            const scrolled = window.scrollY;
            
            const progress = (scrolled / fullHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }
    
    // 添加图片预览功能
    function addImagePreview() {
        // 检查是否在文章页面
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;
        
        // 获取文章中的所有图片
        const images = articleContent.querySelectorAll('img');
        if (images.length === 0) return;
        
        // 为每张图片添加点击事件
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                showImageOverlay(this.src, this.alt);
            });
        });
        
        // 创建图片预览遮罩层
        function showImageOverlay(src, alt) {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'image-preview-overlay';
            
            // 创建图片容器
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-preview-container';
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = src;
            img.alt = alt || '图片预览';
            
            // 创建关闭按钮
            const closeBtn = document.createElement('div');
            closeBtn.className = 'image-preview-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                document.body.removeChild(overlay);
            });
            
            // 添加图片说明
            const caption = document.createElement('div');
            caption.className = 'image-preview-caption';
            caption.textContent = alt || '';
            
            // 组装元素
            imgContainer.appendChild(img);
            imgContainer.appendChild(closeBtn);
            if (alt) imgContainer.appendChild(caption);
            overlay.appendChild(imgContainer);
            
            // 添加到页面
            document.body.appendChild(overlay);
            
            // 点击遮罩层关闭预览
            overlay.addEventListener('click', function() {
                document.body.removeChild(overlay);
            });
            
            // 阻止点击图片容器时关闭预览
            imgContainer.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // 添加文章目录导航
    function addTableOfContents() {
        // 检查是否在文章页面
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;
        
        // 获取文章中的所有标题
        const headings = articleContent.querySelectorAll('h2, h3');
        if (headings.length < 3) return; // 如果标题少于3个，不创建目录
        
        // 创建目录容器
        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';
        tocContainer.innerHTML = '<h3>文章目录</h3>';
        
        // 创建目录列表
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';
        
        // 为每个标题创建目录项
        headings.forEach((heading, index) => {
            // 为标题添加ID，用于锚点定位
            const headingId = 'heading-' + index;
            heading.id = headingId;
            
            // 创建目录项
            const listItem = document.createElement('li');
            listItem.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-item toc-item-h3' : 'toc-item';
            
            const link = document.createElement('a');
            link.href = '#' + headingId;
            link.textContent = heading.textContent;
            
            // 点击链接平滑滚动
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('#' + headingId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        // 将目录列表添加到容器
        tocContainer.appendChild(tocList);
        
        // 将目录添加到文章内容之前
        const articleContainer = document.querySelector('.article-container');
        articleContainer.insertBefore(tocContainer, articleContent);
        
        // 添加固定/折叠目录的功能
        const tocToggle = document.createElement('div');
        tocToggle.className = 'toc-toggle';
        tocToggle.innerHTML = '≡';
        tocContainer.appendChild(tocToggle);
        
        tocToggle.addEventListener('click', function() {
            tocContainer.classList.toggle('toc-collapsed');
        });
        
        // 滚动时高亮当前目录项
        window.addEventListener('scroll', function() {
            const scrollPos = window.scrollY;
            
            // 获取所有带ID的标题
            const headingElements = document.querySelectorAll('.article-content h2[id], .article-content h3[id]');
            
            // 找出当前可见的标题
            let currentHeadingId = '';
            headingElements.forEach(heading => {
                const headingTop = heading.getBoundingClientRect().top + window.scrollY - 100;
                if (scrollPos >= headingTop) {
                    currentHeadingId = heading.id;
                }
            });
            
            // 高亮对应的目录项
            const tocItems = document.querySelectorAll('.toc-item a');
            tocItems.forEach(item => {
                if (item.getAttribute('href') === '#' + currentHeadingId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        });
    }
    
    // 计算文章阅读时间
    function calculateReadingTime() {
        // 检查是否在文章页面
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;
        
        // 获取文章文本内容
        const textContent = articleContent.textContent;
        
        // 计算字数
        const charCount = textContent.length;
        
        // 按平均阅读速度计算阅读时间（中文每分钟约300字）
        const wordsPerMinute = 300;
        const readingTimeMinutes = Math.max(1, Math.ceil(charCount / wordsPerMinute));
        
        // 更新阅读时间
        const durationElement = document.querySelector('.article-meta .duration') || 
                                document.querySelector('.duration');
        
        if (durationElement) {
            durationElement.textContent = `${readingTimeMinutes} 分钟阅读`;
        } else {
            // 如果找不到现有元素，创建一个新的
            const metaElement = document.querySelector('.article-meta');
            if (metaElement) {
                const durationSpan = document.createElement('span');
                durationSpan.className = 'duration';
                durationSpan.textContent = `${readingTimeMinutes} 分钟阅读`;
                metaElement.appendChild(durationSpan);
            }
        }
        
        // 显示文章字数信息
        const metaElement = document.querySelector('.article-meta');
        if (metaElement) {
            const wordCountSpan = document.createElement('span');
            wordCountSpan.className = 'word-count';
            wordCountSpan.textContent = `字数: ${charCount}`;
            metaElement.appendChild(wordCountSpan);
        }
    }
    
    // 添加代码高亮功能
    function addCodeHighlight() {
        // 检查是否在文章页面
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;
        
        // 获取所有代码块
        const codeBlocks = articleContent.querySelectorAll('pre code');
        if (codeBlocks.length === 0) return;
        
        // 简单的语法高亮函数
        function highlightSyntax(code) {
            // 关键字高亮
            const keywords = ['function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'var', 'let', 'const', 'class', 'extends', 'new', 'this', 'import', 'export', 'from', 'try', 'catch', 'finally', 'throw'];
            
            // 转义HTML
            let highlighted = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            // 高亮关键字
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                highlighted = highlighted.replace(regex, `<span class="code-keyword">${keyword}</span>`);
            });
            
            // 高亮字符串
            highlighted = highlighted.replace(/(["'])(.*?)\1/g, '<span class="code-string">$&</span>');
            
            // 高亮注释
            highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>');
            
            return highlighted;
        }
        
        // 为每个代码块应用高亮
        codeBlocks.forEach(block => {
            const originalCode = block.textContent;
            const highlightedCode = highlightSyntax(originalCode);
            block.innerHTML = highlightedCode;
            
            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-btn';
            copyButton.textContent = '复制';
            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(originalCode).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = '已复制!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                });
            });
            
            // 将复制按钮添加到代码块的父元素
            const pre = block.parentElement;
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        });
    }
    
    // 添加页面加载动画
    function addPageLoader() {
        // 创建加载动画元素
        const pageLoader = document.createElement('div');
        pageLoader.className = 'page-loader';
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        
        pageLoader.appendChild(loader);
        document.body.appendChild(pageLoader);
        
        // 当页面加载完成后隐藏加载动画
        window.addEventListener('load', function() {
            pageLoader.classList.add('fade-out');
            
            // 动画结束后移除加载器元素
            setTimeout(function() {
                if (document.body.contains(pageLoader)) {
                    document.body.removeChild(pageLoader);
                }
            }, 500);
        });
    }
    
    // 添加页面过渡效果
    function addPageTransition() {
        // 获取所有内部链接
        const internalLinks = document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href^="./"]:not([target="_blank"]), a[href^="../"]:not([target="_blank"])');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // 检查链接是否有效
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                
                // 阻止默认行为
                e.preventDefault();
                
                // 添加页面过渡动画
                document.body.classList.add('page-transition');
                
                // 短暂延迟后跳转到新页面
                setTimeout(function() {
                    window.location.href = href;
                }, 300);
            });
        });
    }
    
    // 添加相关文章推荐
    function addRelatedArticles() {
        // 检查是否在文章页面
        const articleContainer = document.querySelector('.article-container');
        if (!articleContainer) return;
        
        // 获取当前文章标签
        const tags = Array.from(document.querySelectorAll('.article-tags .tag')).map(tag => tag.textContent.trim());
        if (tags.length === 0) return;
        
        // 模拟相关文章数据 - 在实际项目中，这些数据可以从JSON文件或API获取
        const allArticles = [
            {
                title: '鹿关自然保护区之旅',
                summary: '鹿关自然保护区是我最喜爱的地方之一，每年我都会去几次，每次都有不同的体验和发现...',
                url: 'article.html',
                image: 'img/OIP (1).jpg',
                tags: ['鹿关', '旅行日记', '户外探险']
            },
            {
                title: '鹿关摄影技巧分享',
                summary: '在鹿关拍摄野生动物和风景需要一些特殊的技巧，本文将分享我多年的摄影经验...',
                url: 'article-photo-tips.html',
                image: 'img/OIP (3).jpg',
                tags: ['鹿关', '摄影技巧', '风景摄影', '器材推荐']
            },
            {
                title: '最美的鹿关季节',
                summary: '鹿关一年四季各有特色，什么时候去最好？这篇文章带你了解不同季节的鹿关风光...',
                url: '#',
                image: 'img/OIP (8).jpg',
                tags: ['鹿关', '旅行指南', '季节变化']
            },
            {
                title: '鹿关美食推荐',
                summary: '游览鹿关之后，品尝当地美食是不可错过的体验，这里有我最推荐的几家餐厅...',
                url: '#',
                image: 'img/OIP (5).jpg',
                tags: ['鹿关', '美食推荐', '本地体验']
            },
            {
                title: '鹿关的四季变化',
                summary: '从春天的新芽到冬天的积雪，记录下鹿关一年的变化，欣赏大自然的神奇魔法...',
                url: '#',
                image: 'img/OIP (14).jpg',
                tags: ['鹿关', '季节变化', '风景摄影']
            },
            {
                title: '我和鹿关的故事',
                summary: '第一次遇见鹿关是在十年前的一个夏天，从此我便与这个地方结下了不解之缘...',
                url: '#',
                image: 'img/OIP (9).jpg',
                tags: ['鹿关', '生活随笔', '回忆录']
            }
        ];
        
        // 获取当前文章URL，用于排除自身
        const currentUrl = window.location.pathname.split('/').pop();
        
        // 过滤出相关文章（至少包含一个相同标签，并且不是当前文章）
        const relatedArticles = allArticles.filter(article => {
            if (article.url === currentUrl) return false; // 排除当前文章
            
            // 检查是否有共同标签
            return article.tags.some(tag => tags.includes(tag));
        });
        
        // 如果没有相关文章，返回
        if (relatedArticles.length === 0) return;
        
        // 按相关性排序（共同标签越多越相关）
        relatedArticles.sort((a, b) => {
            const commonTagsA = a.tags.filter(tag => tags.includes(tag)).length;
            const commonTagsB = b.tags.filter(tag => tags.includes(tag)).length;
            return commonTagsB - commonTagsA;
        });
        
        // 最多显示3篇相关文章
        const articlesToShow = relatedArticles.slice(0, 3);
        
        // 创建相关文章部分
        const relatedSection = document.createElement('div');
        relatedSection.className = 'related-articles';
        relatedSection.innerHTML = '<h3>相关阅读</h3>';
        
        // 创建文章卡片容器
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'related-articles-grid';
        
        // 添加文章卡片
        articlesToShow.forEach(article => {
            const card = document.createElement('article');
            card.className = 'related-article-card';
            
            // 创建文章图片
            const imgContainer = document.createElement('div');
            imgContainer.className = 'related-article-img';
            if (article.image) {
                const img = document.createElement('img');
                img.src = article.image;
                img.alt = article.title;
                imgContainer.appendChild(img);
            }
            
            // 创建文章信息
            const infoContainer = document.createElement('div');
            infoContainer.className = 'related-article-info';
            
            // 创建标题
            const title = document.createElement('h4');
            const titleLink = document.createElement('a');
            titleLink.href = article.url;
            titleLink.textContent = article.title;
            title.appendChild(titleLink);
            
            // 创建摘要
            const summary = document.createElement('p');
            summary.className = 'related-article-summary';
            summary.textContent = article.summary.substring(0, 60) + '...';
            
            // 组装元素
            infoContainer.appendChild(title);
            infoContainer.appendChild(summary);
            
            card.appendChild(imgContainer);
            card.appendChild(infoContainer);
            
            cardsContainer.appendChild(card);
        });
        
        // 将卡片容器添加到相关文章部分
        relatedSection.appendChild(cardsContainer);
        
        // 将相关文章部分添加到文章评论之前
        const articleComments = document.querySelector('.article-comments');
        articleContainer.insertBefore(relatedSection, articleComments);
    }
    
   
            
            // 监听滚动事件，在视频进入可视区域时加载
            document.addEventListener('scroll', () => {
                const lazyVideos = document.querySelectorAll('.video-container iframe[data-src]');
                lazyVideos.forEach(iframe => {
                    if (isInViewport(iframe.parentElement)) {
                        iframe.src = iframe.getAttribute('data-src');
                        iframe.removeAttribute('data-src');
                    }
                });
            }, { passive: true }); // 使用passive选项提高滚动性能
        };
        
        // 检查元素是否在视口中
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // 初始化延迟加载
        lazyLoadVideos();
        
        videoCards.forEach(card => {
            const infoSection = card.querySelector('.video-info');
            const overlay = card.querySelector('.video-overlay');
            
            if (infoSection && overlay) {
                // 为标题点击添加事件
                const title = infoSection.querySelector('h3');
                if (title) {
                    title.style.cursor = 'pointer';
                    title.addEventListener('click', function() {
                        const url = overlay.getAttribute('onclick').toString().match(/'(.*?)'/)[1];
                        window.open(url, '_blank');
                    });
                }
                
                // 点击动画效果
                card.addEventListener('click', function() {
                    card.classList.add('clicked');
                    setTimeout(() => {
                        card.classList.remove('clicked');
                    }, 300);
                });
            }
        });
    }
    
    // 初始化页面功能
    function initializePageFeatures() {
        addPageLoader();
        addPageTransition();
        addBackToTopButton();
        addShareButtons();
        enhanceSearch();
        addReadingProgress();
        addImagePreview();
        addTableOfContents();
        calculateReadingTime();
        addCodeHighlight();
        addRelatedArticles();
        setupVideoCards();
    }
    
    // 调用初始化函数
    initializePageFeatures();
}); 