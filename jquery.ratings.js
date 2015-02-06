/**
 * A simple implementation of a rating system
 *
 * Make sure these classes have background images in them.
 * .jquery-ratings-full
 * .jquery-ratings-star
 * 
 * @author http://tech.pro/tutorial/931/how-to-build-a-star-ratings-jquery-plugin
 * @author Mike Rodarte
 * @category jQuery Ratings
 * @package ratings
 */

(function($) {
    var methods = {
        init: function(options) {
            if (typeof options == 'undefined') {
                options = {};
            }
            var settings = $.extend({
                stars: 5,
                rating: 0,
                readOnly: false,
                allowZero: false
            }, options);

            //Save  the jQuery object for later use.
            var elements = this;
        
            //Go through each object in the selector and create a ratings control.
            return this.each(function() {
                // make sure stars is set
                if (!$.isNumeric(settings.stars)) {
                    if ($.isNumeric($(this).data('lastStars'))) {
                        // use the last stars because the stars passed is invalid
                        settings.stars = $(this).data('lastStars');
                    } else {
                        settings.stars = 5;
                    }
                }
                
                //Make sure rating is set.
                if(!$.isNumeric(settings.rating)) {
                    if ($.isNumeric($(this).data('lastRating'))) {
                        // use the last rating because the rating passed is invalid
                        settings.rating = $(this).data('lastRating');
                    } else {
                        settings.rating = 0;
                    }
                }
                
                //Make sure readOnly is set.
                if(settings.readOnly !== true && settings.readOnly !== false) {
                    if ($(this).data('lastReadOnly') === true || $(this).data('lastReadOnly') === false) {
                        // use the last read only because the read only passed is invalid
                        settings.readOnly = $(this).data('lastReadOnly');
                    } else {
                        settings.readOnly = false;
                    }
                }
                
                // check to see if the ratings has already been used
                var initialized = $(this).data('initialized');

                // check for undefined options if ratings has already been initialized
                if (initialized > 0) {
                    // changing other options should not change the stars
                    if (options.stars === undefined) {
                        settings.stars = $(this).data('lastStars');
                    }
                    // changing other options should not change the rating
                    if (options.rating === undefined) {
                        settings.rating = $(this).data('lastRating');
                    }
                    // changing other options should not change the readOnly state
                    if (options.readOnly === undefined) {
                        settings.readOnly = $(this).data('lastReadOnly');
                    }

                    // remove all existing stars
                    $(this).find('.jquery-ratings-star').remove();
                }
    
                //Save the current element for later use.
                var containerElement = this;
        
                //grab the jQuery object for the current container div
                var container = $(this);
        
                //Create an array of stars so they can be referenced again.
                var starsCollection = [];
        
                //Save the initial rating.
                containerElement.rating = settings.rating;
        
                //Set the container div's overflow to auto.  This ensure it will grow to
                //hold all of its children.
                container.css('overflow', 'auto');

                //create each star
                for(var starIdx = 0; starIdx < settings.stars; starIdx++) {
                    //Create a div to hold the star.
                    var starElement = document.createElement('div');
        
                    //Get a jQuery object for this star.
                    var star = $(starElement);
        
                    //Store the rating that represents this star.
                    starElement.rating = starIdx + 1;
        
                    //Add the style.
                    star.addClass('jquery-ratings-star');
        
                    //Add the full css class if the star is beneath the initial rating.
                    if(starIdx < settings.rating) {
                        star.addClass('jquery-ratings-full');
                    }
        
                    //add the star to the container
                    container.append(star);
                    starsCollection.push(star);

                    //hook up the click event
                    star.click(function() {
                        if (!settings.readOnly) {
                            //When clicked, fire the 'ratingchanged' event handler.  Pass the rating through as the data argument.
                            if (containerElement.rating == this.rating && settings.allowZero) {
                                elements.triggerHandler('ratingchanged', {rating: 0});
                                containerElement.rating = 0;
                            } else {
                                elements.triggerHandler('ratingchanged', {rating: this.rating});
                                containerElement.rating = this.rating;
                            }
                        }
                    });
                    star.mouseenter(function() {
                        if (!settings.readOnly) {
                            //Highlight selected stars.
                            var index;
                            for(index = 0; index < this.rating; index++) {
                                if (typeof starsCollection[index] != 'undefined') {
                                    starsCollection[index].addClass('jquery-ratings-full');
                                }
                            }
                            //Unhighlight unselected stars.
                            for(index = this.rating; index < settings.stars; index++) {
                                if (typeof starsCollection[index] != 'undefined') {
                                    starsCollection[index].removeClass('jquery-ratings-full');
                                }
                            }
                        }
                    });
        
                    container.mouseleave(function() {
                        if (!settings.readOnly) {
                            //Highlight selected stars.
                            var index;
                            for(index = 0; index < containerElement.rating; index++) {
                                if (typeof starsCollection[index] != 'undefined') {
                                    starsCollection[index].addClass('jquery-ratings-full');
                                }
                            }
                            //Unhighlight unselected stars.
                            for(index = containerElement.rating; index < settings.stars ; index++) {
                                if (typeof starsCollection[index] != 'undefined') {
                                    starsCollection[index].removeClass('jquery-ratings-full');
                                }
                            }
                        }
                    });
                }
                
                // set data to be used later
                $(this).data('initialized', Math.floor($.now() / 1000));
                $(this).data('lastStars', settings.stars);
                $(this).data('lastRating', settings.rating);
                $(this).data('lastReadOnly', settings.readOnly);
            });
        },
        getStars: function() {
            return this.find('.jquery-ratings-full').length;
        }
    };

    $.fn.ratings = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist in ratings');
        }
    };
})(jQuery);