window.okeReviewsCreateReviewToggle = function(review) {
  var reviewAttributeRatings = $(review).find('.okeReviews-review-attributeRatings');
  var reviewMedia = $(review).find('.okeReviews-review-media');
  var reviewerAttributes = $(review).find('.okeReviews-review-reviewer-attributes');
  var productAttributes = $(review).find('.okeReviews-review-arguments');

  // Create show more button if one doesn't exist
  if (!$(review).find('.toggle-review-content').length) {

      var showAttributes =  document.createElement('div');
      $(showAttributes).addClass('toggle-review-content-wrapper');
      $(showAttributes).html('<a class="toggle-review-content">Read </a>');
      $(showAttributes).insertBefore(reviewAttributeRatings);

      $(showAttributes).click(function() {
        $(reviewAttributeRatings).toggle();
        $(reviewMedia).toggle();
        $(reviewerAttributes).toggle();
        $(productAttributes).toggle();

        // Add classes to show more button
        if($(reviewAttributeRatings).is(':visible')) {
          $(this).find('.toggle-review-content').addClass('visible');
        } else {
          $(this).find('.toggle-review-content').removeClass('visible');
        }
      });

  }
}



window.okeReviewsWidgetOnInit = function() {
  
  // Move write a review button
  var destination = document.querySelector('.okeReviews-reviews-controls');
  var destination2 = document.querySelector('.okeReviews-reviewsWidget-emptyMessage');
  var writeReviewButton = document.querySelector('.js-okeReviews-writeReview');
  if (destination && writeReviewButton) {
    destination.prepend(writeReviewButton);
  } else if (destination2 && writeReviewButton) {
    destination2.append(writeReviewButton);
  }

  //Add class when no media
  var aggregateOuter = document.querySelector('.js-okeReviews-reviewsAggregateContainer');
  var mediaAggregate =  document.querySelector('.okeReviews-reviewsAggregate-mod-itm--medAgg');

  var observer = new MutationObserver(function(list) {
      list.forEach(function(mutation) {
        if (!mediaAggregate.classList.contains('or-u-disNon')) {
          aggregateOuter.classList.add('has-media');
        }
      });
  });

  observer.observe(mediaAggregate, {
      attributes: true
  });



  //Mutation Observer
  var reviewMainElement = document.querySelector('.okeReviews-reviews-main');
  var observer = new MutationObserver(function(reviews) {
      // new reviews have been added to the widget, do something here

  });

  observer.observe(reviewMainElement, {
      childList: true
  });
}
