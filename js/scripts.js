$(document).ready(function() {
    var newsData;

    /**
     * @description this function call the GNews API to get News data, then load data into webview
     * @param {String} topic news topic that you want to get. Topics available are breaking-news,
     *  world, nation, business, technology, entertainment, sports, science and health.
     */
    getNews = (topic) => {
        $("#topicTitle").text(topic);
        $(".article-wrap").remove();
        $("#loadingIcon").css("display", "block");
        var url = "https://gnews.io/api/v4/top-headlines?&token=b419b04e7b5bb952c84e531503646ab9&lang=en&topic=" + topic;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                newsData = data;
                loadData(data);
            });
    }  

    /**
     * @description This function load data from API return into webview
     * @param {Object} data news data
     */
    loadData = (data) => {
        var lastestNews = $("#newsView");
        $("#loadingIcon").css("display", "none");
        data.articles.forEach(news => {
            let article = "";

            article +=
            `<div class="article-wrap col-12 col-md-6 col-xl-4">
                <article>
                    <a href=${news.url} target="_blank">
                        <img src=${news.image} alt="">
                        <div class="news-top">
                            <h2>${news.title}</h2>
                            <em>${news.publishedAt}</em>
                        </div>
                        <div class="news-bottom">
                            <p>${news.description}</p>
                        </div>
                    </a>
                </article>
            </div>`;

            lastestNews.append(article);
        });
    }

    /**
     * Add function to click event of all nav-item that will load news coresponding to selected topic
     */
    $(".nav-item").on("click", function (evt) {
        getNews($(this).text().trim());
        $(".nav-link").removeClass("active");
        $(this).children(".nav-link").addClass("active");
    });

    /**
     * Add function to submit event of searchForm that will perform search request to get news data from search keyword and publish time
     */
    $("#searchForm").submit(function(e) {
        e.preventDefault();
        if (!checkSearchForm()) return false;
        var keyWord = $("#searchInput").val().trim();
        var searchUrl = "https://gnews.io/api/v4/search?q=\"" + keyWord + "\"&from=" + $("#fromTime").val() + ":00Z&token=b419b04e7b5bb952c84e531503646ab9&lang=en";
        searchUrl = encodeURI(searchUrl);
        $('#searchForm').trigger("reset");
        $("#fromTime").parent().hide();
        $("#searchBoxModal").modal("hide");
        console.log(searchUrl);
        $(".article-wrap").remove();
        $("#loadingIcon").css("display", "block");
        $.ajax({
            type: "GET",
            url: searchUrl,
            success: function (response) {
                $("#topicTitle").text("Searches for \"" + keyWord + "\"");
                $(".article-wrap").remove();
                $(".nav-link").removeClass("active");
                $("#loadingIcon").css("display", "none");
                loadData(response);
            }
        });
    });

    // Toggle publish from input box in searchform
    $("#fromTime").parent().hide();
    $("#timeCheckBox").change(function() {
            $("#fromTime").parent().toggle(200);
    });

    /**
     * @description This function is use to validate search box inputs
     * @returns true if form values are valid
     */
    function checkSearchForm() {
        let keyWord = $("#searchInput").val().trim();
        let errorInfo = "";
        let valid = true;

        if(keyWord.length == 0) {
            errorInfo += "Please enter keywords\n";
            $("#searchInput").addClass("error");
            valid = false;
        } else {
            $("#searchInput").removeClass("error");
        }

        if($("#timeCheckBox").is(":checked")) {
            if($("#fromTime").val().trim() == "") {
                $("#fromTime").addClass("error");
                errorInfo += "Please enter \"from\" time\n";
                valid = false;
            } else {
                $("#fromTime").removeClass("error");
            }
        }

        $("#errorInfo").text(errorInfo);
        return valid;
    }

    // Add check input to blur event of form item
    $("#searchInput").blur(checkSearchForm);
    $("#fromTime").blur(checkSearchForm);
    $("#toTime").blur(checkSearchForm);

    // Load breaking-news default
    getNews("breaking-news");
});
