define([
    'jquery',
    'underscore',
    'backbone',
    'models/expense'
], function ($, _, Backbone, Expense) {

    var ExpenseList = Backbone.Collection.extend({
        model: Expense,
        
        // expenses/filter/0 -> business only
        // expenses/filter/1 -> personal only
        // expenses/filter/2 -> all expenses
        url:'api/expenses/filter/2',
        
        initialize: function(options) {
            if(options && options.is_personal != undefined)
                this.url = this.url.replace('/2', '/' + options.is_personal);
        },
        
        getMonthlyTotal: function(is_personal) {
            var total = 0;
            this.models.forEach(function(expense) {
                if(expense.get('is_personal') === is_personal)
                    total += parseInt(expense.get('monthly_cost'));
            });
            return total;
        },

        comparator : function(model) {
            return model.get('order');
        }
    });
    
    return ExpenseList;
});
