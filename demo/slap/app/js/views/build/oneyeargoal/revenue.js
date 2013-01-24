define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/build/oneyeargoal/revenue.html',
    'backboneBinder',
    'backboneValidation'
], function ($, _, Backbone, RevenueTemplate) {

    var RevenueView = Backbone.View.extend({

        tagName: 'li',
        className: 'sort',
        template: _.template(RevenueTemplate),
        _modelBinder: undefined,
        
        events: {
            'click .icon-remove': 'remove',
            'blur .amount input': 'calculateUnitsSold',
            'blur input':'undoValidate',
        },
        
        initialize: function() {
            _.bindAll(this, 'render');
            this._modelBinder = new Backbone.ModelBinder();
            
//            this.model.on('change', this.render, this);
        },
        
        calculateUnitsSold: function() {
            if(this.model.revenueCostList)
                this.model.revenueCostList.trigger('change');
        },
        
        remove: function() {
            if(this.model.id != 0) {
                // also delete the revenue cost list if it exists
                if(this.model.revenueCostList !== undefined) {
                    this.model.revenueCostList.empty();
                }

                // delete the model itself
                this.model.destroy();
            }
            this.$el.remove();
        },
        
        render: function() {
            // tell the revenue cost list about the new values for this revenue
            if(this.model.revenueCostList !== undefined) {
                this.model.revenueCostList.trigger('change');
            }

            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));
            this._modelBinder.bind(this.model, this.el);

            // Validation.
            var that = this;
            Backbone.Validation.bind(this ,{
                valid:function (view, attr) {
                    var $input = that.$('input[name=' + attr + ']');
                    $input.removeClass('invalid');
                    $('.errorMessage_'+ attr).remove();
                },
                invalid:function (view, attr, error) {
                    var $input = that.$('input[name=' + attr + ']');
                    if ($input.length && !$input.hasClass('invalid')) {
                        $input.addClass('invalid').focus();
                        $('.instruction').after('<div id="errorMessage" class="error errorMessage_'+ attr+'">' + error + '</div>');
                    }
                }
            } );
        },

        undoValidate: function() {

            if(this.$el.find('.invalid').attr('name') !== undefined) {

                if(!this.error_alert) {
                    this.error_alert = true;
                    return;
                }

                if(this.error_alert) {
                    $('#errorMessage').remove();
                    this.render();
                    this.error_alert = false;
                }
            }
            else {
                this.error_alert = false;
            }
        },
    });
    
    return RevenueView;
});
