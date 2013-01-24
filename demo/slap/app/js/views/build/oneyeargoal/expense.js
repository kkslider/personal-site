define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/build/oneyeargoal/expense.html',
    'backboneBinder',
    'backboneValidation'
], function ($, _, Backbone, ExpenseTemplate) {

    var ExpenseView = Backbone.View.extend({

        tagName: 'li',
        className: 'sort',
        template: _.template(ExpenseTemplate),
        _modelBinder: undefined,

        events: {
            'click .icon-remove': 'remove',
            'blur .monthly input': 'updateMonthly',
            'blur input':'undoValidate',
        },

        initialize: function() {
            _.bindAll(this, 'render');
            this._modelBinder = new Backbone.ModelBinder();
        },
        remove: function() {
            console.log('removed in view');
            if(this.model.get('id') != 0) {
                this.model.destroy();
            }
            this.$el.remove();
        },

        render: function() {
            var attributes = this.model.toJSON();
            this.$el.html(this.template(attributes));

            // if this expense is the owner's salary, then we shouldn't change it            
            if(this.model.get('name') === 'Owner\'s Salary') {
                (this.$el).removeClass('sort').find('i').detach();
                (this.$el).find('input').attr('disabled', 'disabled');
            }
            
            this._modelBinder.bind(this.model, this.el);
            var that = this;
            Backbone.Validation.bind(this ,{
                valid:function (view, attr) {
                    var $input = that.$('input[name=' + attr + ']');
                    if ($input.length) {
                        $input.removeClass('invalid');
                        if (that.model.isValid()) {
                            $('#errorMessage').remove();
                        }
                    }
                },
                invalid:function (view, attr, error) {
                    var $input = that.$('input[name=' + attr + ']');
                    if ($input.length && !$input.hasClass('invalid')) {
                        $input.addClass('invalid').focus();
                        $('.instruction').after('<div id="errorMessage" class="error">' + error + '</div>');
                    }
                }
            } );
        },

        undoValidate: function() {

            if(this.$el.find('.invalid').attr('name') !== undefined) {

                if(!this.error_alert)  {
                    this.error_alert = true;
                    return;
                }

                if(this.error_alert) {
                    $('#errorMessage').remove();
                    this.render();
                    this.error_alert = false;
                }
            }
        },

        updateMonthly: function() {
            if(this.model.isValid()) {
                var value = Math.round(parseFloat(this.$('.monthly input').val()));
                this.$('.monthly input').val(value)
                this.model.set({'monthly_cost' : value});
                this.model.updateYearly();
            }
        },

  });

  return ExpenseView;
});