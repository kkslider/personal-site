define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/build/oneyeargoal/revenueCost.html',
    'backboneBinder',
], function ($, _, Backbone, RevenueCostTemplate) {

    var RevenueCostView = Backbone.View.extend({

        tagName: 'li',
        className: 'sort',
        template: _.template(RevenueCostTemplate),
        _modelBinder: undefined,
        
        events: {
            'click .icon-remove': 'remove',
        },
        
        initialize: function() {
            _.bindAll(this, 'render');
            this._modelBinder = new Backbone.ModelBinder();

            this.model.on('change', this.render, this);
        },
        
        remove: function() {
            if(this.model.id != 0) {
                this.model.destroy();
            }
            this.$el.remove();
        },
        
        render: function() {

            this.updateAmount();
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

        updateAmount: function() {
            var value = Math.round(parseFloat(this.model.get('amount')));
            this.model.set({'amount' : value});
            this.$('.amount input[name="amount"]').val(value);
        },
    });
    
    return RevenueCostView;
});