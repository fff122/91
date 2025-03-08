document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取搜索查询
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || sessionStorage.getItem('searchQuery') || '';
    
    // 更新搜索框和显示的搜索词
    document.getElementById('header-search').value = searchQuery;
    document.getElementById('search-term-display').textContent = searchQuery;
    
    // 模拟搜索结果数据 - 根据搜索词过滤
    const allSearchData = {
        articles: [
            {
                type: '文章',
                title: '鹿关自然保护区之旅',
                url: 'article.html',
                excerpt: '鹿关自然保护区是我最喜爱的地方之一，每年我都会去几次，每次都有不同的体验和发现...',
                date: '2023-10-15',
                views: '1.2万',
                keywords: '鹿关 自然保护区 徒步 野生动物 摄影 旅游指南'
            },
            {
                type: '文章',
                title: '鹿关摄影技巧分享',
                url: 'article-photo-tips.html',
                excerpt: '在鹿关拍摄野生动物和风景需要一些特殊的技巧，本文将分享我多年的摄影经验...',
                date: '2023-09-22',
                views: '8.5千',
                keywords: '鹿关 摄影 技巧 野生动物 镜头 相机 设备'
            },
            {
                type: '文章',
                title: '最美的鹿关季节',
                url: '#',
                excerpt: '鹿关一年四季各有特色，什么时候去最好？这篇文章带你了解不同季节的鹿关风光...',
                date: '2023-08-17',
                views: '6.7千',
                keywords: '鹿关 季节 风景 自然 四季 春夏秋冬'
            },
            {
                type: '文章',
                title: '鹿关美食推荐',
                url: '#',
                excerpt: '游览鹿关之后，品尝当地美食是不可错过的体验，这里有我最推荐的几家餐厅...',
                date: '2023-07-30',
                views: '5.3千',
                keywords: '鹿关 美食 餐厅 当地特色 推荐 小吃'
            },
            {
                type: '文章',
                title: '鹿关的四季变化',
                url: '#',
                excerpt: '从春天的新芽到冬天的积雪，记录下鹿关一年的变化，欣赏大自然的神奇魔法...',
                date: '2023-06-14',
                views: '3.2千',
                keywords: '鹿关 四季 变化 自然 生态 环境'
            },
            {
                type: '文章',
                title: '我和鹿关的故事',
                url: '#',
                excerpt: '第一次遇见鹿关是在十年前的一个夏天，从此我便与这个地方结下了不解之缘...',
                date: '2023-05-08',
                views: '4.8千',
                keywords: '鹿关 故事 旅行 回忆 经历 个人'
            }
        ],
        galleries: [
            {
                type: '照片',
                title: '秋天的鹿关',
                url: 'gallery.html',
                excerpt: '金黄色的树叶铺满山谷，远处的群山如画卷般伸展。拍摄于2022年10月。',
                date: '2022-10-10',
                views: '3.4千',
                keywords: '鹿关 秋天 风景 摄影 秋叶 山谷'
            },
            {
                type: '照片',
                title: '山间的鹿',
                url: 'gallery.html',
                excerpt: '清晨，一只野鹿在薄雾中觅食。使用600mm长焦镜头拍摄。',
                date: '2023-04-18',
                views: '2.8千',
                keywords: '鹿 野生动物 摄影 清晨 薄雾'
            },
            {
                type: '照片',
                title: '鹿关日出',
                url: 'gallery.html',
                excerpt: '清晨的第一缕阳光穿透云层，洒在山谷中。这是我最喜欢的拍摄地点之一。',
                date: '2023-03-05',
                views: '4.1千',
                keywords: '鹿关 日出 风景 摄影 清晨 阳光'
            },
            {
                type: '照片',
                title: '冬日鹿关',
                url: 'gallery.html',
                excerpt: '大雪覆盖了整个山谷，仿佛置身童话世界。拍摄于2023年1月的一场大雪后。',
                date: '2023-01-15',
                views: '3.9千',
                keywords: '鹿关 冬天 雪景 摄影 山谷 白雪'
            }
        ],
        tags: [
            {
                type: '标签',
                title: '鹿关',
                url: 'articles.html?tag=鹿关',
                excerpt: '与鹿关相关的所有文章和照片，包括旅行指南、摄影技巧、风景展示等内容。',
                count: '12篇文章',
                keywords: '鹿关'
            },
            {
                type: '标签',
                title: '摄影技巧',
                url: 'articles.html?tag=摄影',
                excerpt: '关于摄影技巧的文章集合，包括器材选择、拍摄角度、后期处理等内容。',
                count: '5篇文章',
                keywords: '摄影 技巧 相机 镜头 构图'
            },
            {
                type: '标签',
                title: '野生动物',
                url: 'articles.html?tag=野生动物',
                excerpt: '关于野生动物的文章和照片，主要是鹿关地区的野生动物观察和摄影作品。',
                count: '7篇文章',
                keywords: '野生动物 鹿 鸟类 生态 自然'
            },
            {
                type: '标签',
                title: '旅行指南',
                url: 'articles.html?tag=旅游指南',
                excerpt: '鹿关地区的旅行指南，包括路线推荐、住宿建议、交通信息等实用内容。',
                count: '4篇文章',
                keywords: '旅行 指南 攻略 路线 住宿'
            }
        ]
    };
    
    // 根据搜索词过滤搜索结果
    function filterSearchData(query) {
        if (!query) return allSearchData;
        
        query = query.toLowerCase();
        const filteredData = {
            articles: [],
            galleries: [],
            tags: []
        };
        
        // 过滤文章
        filteredData.articles = allSearchData.articles.filter(article => {
            return article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query) ||
                article.keywords.toLowerCase().includes(query);
        });
        
        // 过滤照片
        filteredData.galleries = allSearchData.galleries.filter(gallery => {
            return gallery.title.toLowerCase().includes(query) ||
                gallery.excerpt.toLowerCase().includes(query) ||
                gallery.keywords.toLowerCase().includes(query);
        });
        
        // 过滤标签
        filteredData.tags = allSearchData.tags.filter(tag => {
            return tag.title.toLowerCase().includes(query) ||
                tag.excerpt.toLowerCase().includes(query) ||
                tag.keywords.toLowerCase().includes(query);
        });
        
        return filteredData;
    }
    
    // 过滤并显示搜索结果
    function filterResults(filter = 'all') {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; // 清空当前结果
        
        // 根据搜索词过滤数据
        const searchData = filterSearchData(searchQuery);
        
        let results = [];
        
        if (filter === 'all' || filter === 'article') {
            results = results.concat(searchData.articles);
        }
        
        if (filter === 'all' || filter === 'gallery') {
            results = results.concat(searchData.galleries);
        }
        
        if (filter === 'all' || filter === 'tag') {
            results = results.concat(searchData.tags);
        }
        
        // 更新结果数量
        document.getElementById('result-count').textContent = results.length;
        
        // 如果没有结果，显示无结果信息
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h2>没有找到与 "${searchQuery}" 相关的结果</h2>
                    <p>建议：</p>
                    <ul>
                        <li>检查您的拼写</li>
                        <li>尝试使用不同的关键词</li>
                        <li>尝试使用更一般的关键词</li>
                        <li>尝试使用较少的关键词</li>
                    </ul>
                </div>
            `;
            return;
        }
        
        // 为每个结果创建DOM元素
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            resultElement.setAttribute('data-type', result.type === '文章' ? 'article' : (result.type === '照片' ? 'gallery' : 'tag'));
            
            // 高亮搜索词在标题和摘要中
            let highlightedTitle = result.title;
            let highlightedExcerpt = result.excerpt;
            
            if (searchQuery) {
                const regex = new RegExp(searchQuery, 'gi');
                highlightedTitle = highlightedTitle.replace(regex, match => `<span class="highlight">${match}</span>`);
                highlightedExcerpt = highlightedExcerpt.replace(regex, match => `<span class="highlight">${match}</span>`);
            }
            
            resultElement.innerHTML = `
                <span class="result-type">${result.type}</span>
                <h2 class="result-title"><a href="${result.url}">${highlightedTitle}</a></h2>
                <p class="result-excerpt">${highlightedExcerpt}</p>
                <div class="result-meta">
                    ${result.date ? `<span>发布日期: ${result.date}</span>` : ''}
                    ${result.views ? `<span>${result.views} 浏览</span>` : ''}
                    ${result.count ? `<span>${result.count}</span>` : ''}
                </div>
            `;
            
            resultsContainer.appendChild(resultElement);
        });
    }
    
    // 设置过滤器切换
    const filterButtons = document.querySelectorAll('.search-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            // 根据按钮的过滤值筛选结果
            const filterValue = this.getAttribute('data-filter');
            filterResults(filterValue);
        });
    });
    
    // 设置搜索功能
    const headerSearchInput = document.getElementById('header-search');
    const headerSearchBtn = document.getElementById('header-search-btn');
    
    headerSearchBtn.addEventListener('click', function() {
        const query = headerSearchInput.value.trim();
        if (query !== '') {
            // 更新URL和搜索显示
            sessionStorage.setItem('searchQuery', query);
            window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
    });
    
    headerSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            headerSearchBtn.click();
        }
    });
    
    // 添加相关推荐
    function addSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;
        
        const suggestions = [
            { title: '鹿关徒步指南', url: '#' },
            { title: '鹿关野生动物观察指南', url: '#' },
            { title: '鹿关摄影最佳时间和地点', url: '#' },
            { title: '鹿关周边美食推荐', url: '#' },
            { title: '鹿关四季风光', url: '#' }
        ];
        
        // 清空当前内容
        suggestionsContainer.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${suggestion.url}">${suggestion.title}</a>`;
            suggestionsContainer.appendChild(li);
        });
    }
    
    // 设置分页功能
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
        });
    });
    
    // 初始化页面
    filterResults();
    addSuggestions();
}); 