    document.addEventListener('DOMContentLoaded', function () {
      var main = new Splide('#main-carousel', {
        type: 'fade',
        rewind: true,
        pagination: false,
        arrows: false,
      });


      var thumbnails = new Splide('#thumbnail-carousel', {
        fixedWidth: 100, //スライドの幅自体を固定
        fixedHeight: 60,
        gap: 30, //スライド間の余白を指定
        rewind: true, //スライダーの終わりまで行ったときに、先頭に巻き戻す
        pagination: false, //ページネーションを表示しない
        cover: true,
        isNavigation: true, //各スライドをクリック可能
        padding: {
          left: '50px',
        },
        breakpoints: {
          600: {
            fixedWidth: 60,
            fixedHeight: 44,
          },
        },
      });


      main.sync(thumbnails); //2つのスライダーを同期
      main.mount();
      thumbnails.mount();
    });