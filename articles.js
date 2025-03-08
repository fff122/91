document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取分类或标签参数
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const tagParam = urlParams.get('tag');
    
    // 如果有分类参数，自动选择对应的分类
    if (categoryParam) {
        const categorySelect = document.getElementById('category-filter');
        const options = Array.from(categorySelect.options);
        
        // 尝试找到匹配的选项
        const matchingOption = options.find(option => 
            option.textContent.toLowerCase() === categoryParam.toLowerCase());
        
        if (matchingOption) {
            categorySelect.value = matchingOption.value;
            // 触发变更事件以应用筛选
            const event = new Event('change');
            categorySelect.dispatchEvent(event);
        } else {
            // 如果没有精确匹配，尝试部分匹配
            const partialMatch = options.find(option => 
                option.textContent.toLowerCase().includes(categoryParam.toLowerCase()));
            
            if (partialMatch) {
                categorySelect.value = partialMatch.value;
                const event = new Event('change');
                categorySelect.dispatchEvent(event);
            }
        }
    }
    
    // 如果有标签参数，自动选择对应的标签
    if (tagParam) {
        const tagFilters = document.querySelectorAll('.tag-filter');
        let tagFound = false;
        
        tagFilters.forEach(tag => {
            const tagText = tag.textContent.trim();
            if (tagText.toLowerCase() === tagParam.toLowerCase()) {
                // 移除所有标签的active类
                tagFilters.forEach(t => t.classList.remove('active'));
                // 为匹配的标签添加active类
                tag.classList.add('active');
                tagFound = true;
                
                // 触发点击事件以应用筛选
                tag.click();
            }
        });
        
        // 如果没有找到精确匹配，尝试部分匹配
        if (!tagFound) {
            tagFilters.forEach(tag => {
                const tagText = tag.textContent.trim();
                if (tagText.toLowerCase().includes(tagParam.toLowerCase())) {
                    tagFilters.forEach(t => t.classList.remove('active'));
                    tag.classList.add('active');
                    tag.click();
                }
            });
        }
    }
    
    // 标签点击切换
    const tagFilters = document.querySelectorAll('.tag-filter');
    
    tagFilters.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除所有标签的active类
            tagFilters.forEach(t => t.classList.remove('active'));
            
            // 给当前点击的标签添加active类
            this.classList.add('active');
            
            // 获取标签值
            const tagValue = this.getAttribute('data-tag');
            console.log('过滤标签:', tagValue);
            
            // 过滤文章显示
            filterArticlesByTag(tagValue);
        });
    });
    
    // 根据标签过滤文章
    function filterArticlesByTag(tag) {
        const articles = document.querySelectorAll('.article-item');
        
        if (tag === 'all') {
            // 显示所有文章
            articles.forEach(article => {
                article.style.display = 'flex';
            });
            return;
        }
        
        // 根据标签过滤
        articles.forEach(article => {
            const articleTags = article.getAttribute('data-tags');
            if (articleTags && articleTags.includes(tag)) {
                article.style.display = 'flex';
            } else {
                article.style.display = 'none';
            }
        });
    }
    
    // 排序和分类筛选
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    categoryFilter.addEventListener('change', function() {
        const categoryValue = this.value;
        console.log('分类筛选:', categoryValue);
        
        // 根据分类筛选文章
        filterArticlesByCategory(categoryValue);
    });
    
    // 根据分类过滤文章
    function filterArticlesByCategory(category) {
        const articles = document.querySelectorAll('.article-item');
        
        if (category === 'all') {
            // 显示所有文章
            articles.forEach(article => {
                article.style.display = 'flex';
            });
            return;
        }
        
        // 根据分类筛选
        articles.forEach(article => {
            const articleCategory = article.querySelector('.article-category').textContent.toLowerCase();
            if (articleCategory.includes(category) || category.includes(articleCategory)) {
                article.style.display = 'flex';
            } else {
                article.style.display = 'none';
            }
        });
    }
    
    sortFilter.addEventListener('change', function() {
        const sortValue = this.value;
        console.log('排序方式:', sortValue);
        
        // 根据排序方式对文章排序
        sortArticles(sortValue);
    });
    
    // 根据不同方式排序文章
    function sortArticles(sortMethod) {
        const articlesList = document.querySelector('.articles-list');
        const articles = Array.from(articlesList.querySelectorAll('.article-item'));
        
        switch (sortMethod) {
            case 'newest':
                articles.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.article-date').textContent);
                    const dateB = new Date(b.querySelector('.article-date').textContent);
                    return dateB - dateA; // 降序，最新的在前
                });
                break;
                
            case 'oldest':
                articles.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.article-date').textContent);
                    const dateB = new Date(b.querySelector('.article-date').textContent);
                    return dateA - dateB; // 升序，最老的在前
                });
                break;
                
            case 'popular':
                articles.sort((a, b) => {
                    const likesA = parseFloat(a.querySelector('.article-likes').textContent);
                    const likesB = parseFloat(b.querySelector('.article-likes').textContent);
                    return likesB - likesA; // 降序，最受欢迎的在前
                });
                break;
                
            case 'views':
                articles.sort((a, b) => {
                    const viewsA = a.querySelector('.article-views').textContent;
                    const viewsB = b.querySelector('.article-views').textContent;
                    
                    // 提取数值部分
                    const numA = parseFloat(viewsA.replace(/[^0-9.]/g, ''));
                    const numB = parseFloat(viewsB.replace(/[^0-9.]/g, ''));
                    
                    // 考虑单位（万、千等）
                    const unitA = viewsA.includes('万') ? 10000 : (viewsA.includes('千') ? 1000 : 1);
                    const unitB = viewsB.includes('万') ? 10000 : (viewsB.includes('千') ? 1000 : 1);
                    
                    return (numB * unitB) - (numA * unitA); // 降序，浏览最多的在前
                });
                break;
        }
        
        // 重新添加排序后的文章
        articles.forEach(article => {
            articlesList.appendChild(article);
        });
    }
    
    // 搜索功能
    const searchInput = document.getElementById('article-search');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', function() {
        const searchQuery = searchInput.value.trim();
        if (searchQuery !== '') {
            // 将搜索词存入sessionStorage并跳转到搜索结果页面
            sessionStorage.setItem('searchQuery', searchQuery);
            window.location.href = `search-results.html?q=${encodeURIComponent(searchQuery)}`;
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // 分页功能
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(.disabled)');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active') || this.classList.contains('disabled')) {
                return;
            }
            
            // 移除所有页码按钮的active类
            document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
            
            // 如果是数字页码，添加active类
            if (!isNaN(this.textContent)) {
                this.classList.add('active');
            }
            
            // 获取页码
            const pageText = this.textContent;
            let page;
            
            if (pageText.includes('上一页')) {
                const activePage = document.querySelector('.pagination-btn.active');
                page = parseInt(activePage.textContent) - 1;
            } else if (pageText.includes('下一页')) {
                const activePage = document.querySelector('.pagination-btn.active');
                page = parseInt(activePage.textContent) + 1;
            } else {
                page = parseInt(pageText);
            }
            
            console.log('跳转到页面:', page);
            
            // 模拟加载不同页的文章
            loadArticlePage(page);
        });
    });
    
    // 模拟加载对应页码的文章
    function loadArticlePage(page) {
        // 在实际应用中，这里应该是向服务器请求对应页码的文章
        // 这里只是为了演示，简单地隐藏所有文章，然后显示一条消息
        
        const articlesList = document.querySelector('.articles-list');
        const articles = articlesList.querySelectorAll('.article-item');
        
        // 隐藏所有文章
        articles.forEach(article => {
            article.style.display = 'none';
        });
        
        // 创建一条消息
        const message = document.createElement('div');
        message.className = 'article-item';
        message.style.textAlign = 'center';
        message.style.padding = '50px 0';
        
        message.innerHTML = `
            <div class="article-content" style="width: 100%;">
                <h2 style="margin: 0 0 20px; border: none;">已加载第 ${page} 页的文章</h2>
                <p>这是一个演示。在实际应用中，这里会显示从服务器加载的真实文章。</p>
                <button id="reset-demo" style="margin-top: 20px; padding: 10px 20px; background-color: #ff9000; color: #000; border: none; border-radius: 5px; cursor: pointer;">
                    重置演示
                </button>
            </div>
        `;
        
        articlesList.appendChild(message);
        
        // 添加重置演示的按钮点击事件
        const resetBtn = document.getElementById('reset-demo');
        resetBtn.addEventListener('click', function() {
            message.remove();
            
            // 重新显示所有文章
            articles.forEach(article => {
                article.style.display = 'flex';
            });
            
            // 重置页码
            document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.pagination-btn:nth-child(2)').classList.add('active');
        });
    }
    
    // 为文章添加标签属性
    function addTagsToArticles() {
        const articles = document.querySelectorAll('.article-item');
        
        // 文章标签数据
        const articleTags = [
            { title: '鹿关自然保护区之旅', tags: 'travel,nature,wildlife,鹿关,自然保护区,徒步旅行' },
            { title: '鹿关摄影技巧分享', tags: 'photography,wildlife,tips,鹿关,摄影,技巧' },
            { title: '最美的鹿关季节', tags: 'seasons,nature,photography,鹿关,季节,风景' },
            { title: '鹿关美食推荐', tags: 'food,travel,recommendations,鹿关,美食,推荐' },
            { title: '鹿关的四季变化', tags: 'seasons,nature,photography,鹿关,季节,自然' },
            { title: '我和鹿关的故事', tags: 'personal,travel,story,鹿关,旅行,故事' }
        ];
        
        // 为每篇文章添加标签属性
        articles.forEach(article => {
            const titleElement = article.querySelector('.article-title');
            if (!titleElement) return;
            
            const title = titleElement.textContent.trim();
            
            // 查找匹配的标签
            const matchingTags = articleTags.find(item => item.title === title);
            
            if (matchingTags) {
                article.setAttribute('data-tags', matchingTags.tags);
            }
        });
    }
    
    // 初始化页面
    function initArticlesPage() {
        // 为文章添加标签属性
        addTagsToArticles();
        
        // 检查是否有URL参数
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('category') && !urlParams.has('tag')) {
            // 默认筛选：显示所有文章
            filterArticlesByTag('all');
        }
    }
    
    // 运行初始化函数
    initArticlesPage();
}); 