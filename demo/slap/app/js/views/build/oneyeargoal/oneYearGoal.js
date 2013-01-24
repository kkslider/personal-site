define([
    'jquery',
    'underscore',
    'backbone',
    'models/expense',
    'views/build/oneyeargoal/expense',
    'collections/expenseList',
    'views/build/oneyeargoal/expenseList',
    'models/revenue',
    'views/build/oneyeargoal/revenue',
    'collections/revenueList',
    'views/build/oneyeargoal/revenueList',
    'text!templates/build/oneyeargoal/begin.html',
    'text!templates/build/oneyeargoal/complete.html',
    'text!templates/build/oneyeargoal/breakeven.html',
], function ($, _, Backbone,  Expense, ExpenseView, ExpenseList, ExpenseListView, Revenue, RevenueView, RevenueList, RevenueListView, BeginTemplate, CompleteTemplate, BreakevenTemplate) {

    var OneYearGoalPage = Backbone.View.extend({
    
        // setup begin and end templates to render those pages directly
        beginTemplate: _.template(BeginTemplate),
        completeTemplate: _.template(CompleteTemplate),
        breakevenTemplate: _.template(BreakevenTemplate),
        
        el: '.page',
        currentView: undefined,
        breakevenPoint: undefined,
        buildModel: undefined,
        
        initialize: function (options) {
            console.log(options);
            _.bindAll(this, 'render');
            Backbone.history.navigate('#oneYearGoal');
            this.header = options.header;
            this.expenseList = Array(2);
            this.progressBarView = options.progressBarView;
            this.progressBarView.currentView = this;
            this.buildModel = options.buildModel;
        },
        
        events: {
            // begin
            'click #prev[data-phase="2"][data-step="1"]': 'previousPhase',
            'click #next[data-phase="2"][data-step="1"]': 'personalExpenses',
            
            // personal expenses
            'click #prev[data-phase="2"][data-step="2"]': 'begin',
            'click #next[data-phase="2"][data-step="2"]': 'businessExpenses',
            
            // business expenses
            'click #prev[data-phase="2"][data-step="3"]': 'personalExpenses',
            'click #next[data-phase="2"][data-step="3"]': 'breakeven',
            
            // breakeven point
            'click #prev[data-phase="2"][data-step="4"]': 'businessExpenses',
            'click #next[data-phase="2"][data-step="4"]': 'revenueStreams',

            // revenue streams
            'click #prev[data-phase="2"][data-step="5"]': 'breakeven',
            'click #next[data-phase="2"][data-step="5"]': 'revenuePercentages',
            
            // revenue percentages
            'click #prev[data-phase="2"][data-step="6"]': 'revenueStreams',
            'click #next[data-phase="2"][data-step="6"]': 'totalRevenue',
            
            // total revenue
            'click #prev[data-phase="2"][data-step="7"]': 'revenuePercentages',
            'click #next[data-phase="2"][data-step="7"]': 'averageSellingPrice',
            
            // average selling price
            'click #prev[data-phase="2"][data-step="8"]': 'totalRevenue',
            'click #next[data-phase="2"][data-step="8"]': 'variableCosts',
            
            // variable costs
            'click #prev[data-phase="2"][data-step="9"]': 'averageSellingPrice',
            'click #next[data-phase="2"][data-step="9"]': 'unitsOfSale',
            
            // units of sale
            'click #prev[data-phase="2"][data-step="10"]': 'variableCosts',
            'click #next[data-phase="2"][data-step="10"]': 'goalCheck',
            
            // goal check
            'click #prev[data-phase="2"][data-step="11"]': 'unitsOfSale',
            'click #next[data-phase="2"][data-step="11"]': 'realityCheck',
            
            // reality check
            'click #prev[data-phase="2"][data-step="12"]': 'goalCheck',
            'click #next[data-phase="2"][data-step="12"]': 'complete',
            
            // complete
            'click #prev[data-phase="2"][data-step="13"]': 'realityCheck',
            'click #next[data-phase="2"][data-step="13"]': 'nextPhase',

        },
        
        previousPhase: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - previousPhase');
            
            if(this.currentView != undefined) {
                this.currentView.clean();
            }
            
            var that = this;
            var progressBarView = this.progressBarView;
            
            require(['views/build/statement/complete1'],
                function (BuildPage) {
                    that.buildView = new BuildPage({progressBarView: progressBarView});
                    that.buildView.render();
                    return false;
                });
        },
        
        begin: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - begin');

            if(this.currentView != undefined) {
                this.currentView.clean();
            }

            this.$el.html(this.beginTemplate());
            this.progressBarView.update(5);

            // video
            this.setVideo('s12a');
        },
        
        personalExpenses: function(e) {
            if(e) e.preventDefault();
            this.clean();
            console.log('one year goal - personal expenses');
            
            if(this.currentView != undefined) {
                this.currentView.clean();
            }
            
            if(!this.expenseList[1]) {
                this.expenseList[1] = new ExpenseList({ is_personal: 1 });
                this.expenseList[1].fetch();
            }
            var expenseListView = new ExpenseListView({ collection: this.expenseList[1], is_personal: 1 });
            expenseListView.render();
            
            // hide the page elements in the template that aren't for this page
            $('.page-business, .page-breakeven').hide();
            $('.page-personal').show();
            
            // be able to figure out what type of new expense is being added
            expenseListView.$('li.new').attr('data-type', 'personal');
            expenseListView.$('li.incidentals').attr('data-type', 'personal');

            // no need to hook up the action buttons to go to the correct steps
            // as the template starts with data-step = 2
            
            this.currentView = expenseListView;
            this.progressBarView.update(6);

            // video
            this.setVideo('s13');
        },
        
        businessExpenses: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - business expenses');
            
            if(this.currentView != undefined) {
                this.currentView.clean();
            }
            
            if(!this.expenseList[0]) {
                this.expenseList[0] = new ExpenseList({ is_personal: 0 });
                this.expenseList[0].fetch();
            }
            
            var expenseListView = new ExpenseListView({ collection: this.expenseList[0], is_personal: 0 });
            expenseListView.render();
            
            // hide the page elements in the template that aren't for this page
            $('.page-personal, .page-breakeven').hide();
            $('.page-business').show();
            
            // be able to figure out what type of new expense is being added
            $('li.new').attr('data-type', 'business');
            $('li.incidentals').attr('data-type', 'business');
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '3');

            this.currentView = expenseListView;
            this.progressBarView.update(7);

            // video
            this.setVideo('s14a');
        },
        
        breakeven: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - breakeven');
            
            if(this.currentView != undefined) {
                this.currentView.clean();
            }
            
            // get all expenses to calculate totals
            var expenseList = new ExpenseList(),
                personalMonthly = 0,
                businessMonthly = 0,
                attributes = [],
                that = this;
            expenseList.fetch({
                // need to do everything inside success to make sure the call has finished
                success: function() {
                    // get monthly and yearly totals for personal, business and all expenses
                    // business expenses includes owner's salary, i.e. personal expenses
                    personalMonthly = expenseList.getMonthlyTotal('1');
                    businessMonthly = expenseList.getMonthlyTotal('0');
                    console.log(personalMonthly + ' ' + businessMonthly);
                    attributes = {
                        'personalMonthly': personalMonthly,
                        'personalYearly' : personalMonthly * 12,
                        'businessMonthly': businessMonthly - personalMonthly,
                        'businessYearly':  (businessMonthly - personalMonthly) * 12,
                        'totalMonthly': businessMonthly,
                        'totalYearly': businessMonthly * 12
                    };
                    that.$el.html(that.breakevenTemplate(attributes));
                    that.breakevenPoint = businessMonthly * 12;

                    // video
                    that.setVideo('s15');
                }
            });

            // no need to hook up the action buttons to go to the correct steps
            // as the template starts with data-step = 4
            
            // TODO what should this be set to?
            this.currentView = undefined;
            this.progressBarView.update(7);
        },
        
        // need to know the breakeven point if we come to 1 year goal not through the breakeven page
        calculateBreakevenPoint: function(e) {
            var expenseList = new ExpenseList(),
                that = this;
            expenseList.fetch({
                success: function() {
                    // business expenses includes owner's salary, i.e. personal expenses
                    businessMonthly = expenseList.getMonthlyTotal('0');
                    that.breakevenPoint = businessMonthly * 12;
                    $('#breakeven').text(that.breakevenPoint);
                    if(that.currentView)
                       that.currentView.calculateTotalRevenues(that.breakevenPoint);
                }
            });
            $('#breakeven').text(this.breakevenPoint);
        },
        
        revenueStreams: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - revenue streams');
      
            if(this.currentView !== undefined) {
                this.currentView.clean();
            }

            var that = this;
            if(!this.revenueList) {
                this.revenueList = new RevenueList();
                this.revenueList.fetch({success: function() {
                    if(that.shiftStep)
                    {

                        switch(that.shiftStep) {
//                            case '5':
//                                that.buildView.revenueStreams();
//                                break;

                            case '8':
                                that.revenueStreams();
                                that.averageSellingPrice();
                                break;

                            case '9':
                                that.revenueStreams();
                                that.revenuePercentages();
                                that.totalRevenue();
                                that.averageSellingPrice();
                                that.variableCosts();
                                break;

                            case '11':
                                that.revenueStreams();
                                that.revenuePercentages();
                                that.totalRevenue();
                                that.averageSellingPrice();
                                that.variableCosts();
                                that.goalCheck();
                                break;

                            case '12':
                                that.revenueStreams();
                                that.revenuePercentages();
                                that.totalRevenue();
                                that.averageSellingPrice();
                                that.variableCosts();
                                that.goalCheck();
                                that.realityCheck();
                                break;
                        }
                        that.shiftStep = undefined;
                    }
                }});
            }

            // Revenue Cost List Clean.
            this.revenueList.forEach(function(r) {
                if(r.revenueCostListView)
                    r.revenueCostListView.remove();
            });

            var revenueListView = new RevenueListView({ collection: this.revenueList });
            revenueListView.render();
            
            // display only the page elements relevant for this page
            $('.total, .step').hide();
            $('.revenue-streams-page').show();
            $('.icon-remove').css({'visibility': 'visible'});

            console.log(this.breakevenPoint);
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }

            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: none; } .units { display: none; } .percent { display: none; } .revenue { display: none; } </style>'));

            // no need to hook up the action buttons to go to the correct steps
            // as the template starts with data-step = 5
            
            this.currentView = revenueListView;
            this.progressBarView.update(8);

            // video
            this.setVideo('s19');
        },
        
        revenuePercentages: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - revenue percentages');
      
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }

            // Revenue Cost List Clean.
            this.revenueList.forEach(function(r) {
                if(r.revenueCostListView)
                    r.revenueCostListView.remove();
            });

            // now the current view is revenues, so we can just adjust from there
            this.currentView.calculateTotalPercent();
            
            
            // display only the page elements relevant for this page
            $('.step').hide();
            $('.total, .revenue-percentages-page').show();
            $('.icon-remove').css({'visibility': 'hidden'});
            
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }
            
            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: none; } .units { display: none; } .percent { display: inline-block; } .revenue { display: none; } </style>'));
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '6');
            this.currentView.options.collection.forEach(function(m) {
                m.step = 6;
            });

            // current view and progress bar already set


            
        },
        
        totalRevenue: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - total revenue');
      
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }
            else {
                // Alert if total percent is not equal to 100%.
                $('.errorMessage').remove();
                if(this.currentView.totalPercent !== 100) {
                    $('.instruction').after('<div id="errorMessage" class="error errorMessage">Total percent should equal to 100%</div>');
                    return;
                }
            }

            // Revenue Cost List Clean.
            this.revenueList.forEach(function(r) {
                if(r.revenueCostListView)
                    r.revenueCostListView.remove();
            });

            // now the current view is revenues, so we can just adjust from there
            
            // compute the total revenue for each revenue stream
            this.currentView.calculateTotalRevenues(this.breakevenPoint);
            
            // display only the page elements relevant for this page
            $('.new, .step').hide();
            $('.total, .total-revenue-page').show();
            $('.icon-remove').css({'visibility': 'hidden'});
            
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }
            
            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: none; } .units { display: none; } .percent { display: none; } .revenue { display: inline-block; } </style>'));
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '7');

            this.currentView.options.collection.forEach(function(m) {
                m.step = 7;
            });
            // current view and progress bar already set

        },
        
        averageSellingPrice: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - average selling price');
      
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }

            // Revenue Cost List Clean.
            this.revenueList.forEach(function(r) {
                if(r.revenueCostListView)
                    r.revenueCostListView.remove();
            });

            // now the current view is revenues, so we can just adjust from there
            
            // display only the page elements relevant for this page
            $('.step').hide();
            $('.total, .average-selling-price-page').show();
            $('.icon-remove').css({'visibility': 'hidden'});
            
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }
            
            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: inline-block; } .units { display: none; } .percent { display: none; } .revenue { display: inline-block; } </style>'));
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '8');
            
            // current view already set
            this.progressBarView.update(9);

            this.currentView.options.collection.forEach(function(m) {
                m.step = 8;
            });
        },
        
        variableCosts: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - variable costs');
            
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }

            // Revenue Cost List Clean.
            this.revenueList.forEach(function(r) {
                if(r.revenueCostListView)
                    r.revenueCostListView.remove();
            });

            // now the current view is revenues, so we can just adjust from there
            this.currentView.showVariableCosts();
            
            /*
            var revenueList = new RevenueList();
            revenueList.fetch({
                success: function() {
                    var revenueListView = new RevenueListView({ collection: revenueList });
                    revenueListView.render();
                    revenueListView.showVariableCosts();
                }
            });
            */
            
            // display only the page elements relevant for this page
            $('.step, .new + .total').hide();
            $('.total, .variable-costs-page').show();
            $('.icon-remove, .icon-resize-vertical').css({'visibility': 'hidden'});
            
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }
            
            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: inline-block; } .units { display: none; } .percent { display: none; } .revenue { display: inline-block; } </style>'));
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '9');
            
            // current view already set
            this.progressBarView.update(10);

            this.currentView.options.collection.forEach(function(m) {
                m.step = 9;
            });

            // video
            this.setVideo('s22a');
        },
        
        unitsOfSale: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - units of sale');
            
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }
            
            // now the current view is revenues, so we can just adjust from there
            this.currentView.showUnitsSold();
            
            // display only the page elements relevant for this page
            $('.step, .new + .total').hide();
            $('.total, .units-of-sale-page').show();
            $('.icon-resize-vertical, .icon-remove').css({'visibility': 'hidden'});
            
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }
            
            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: inline-block; } .units { display: inline-block; } .percent { display: none; } .revenue { display: inline-block; } </style>'));
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '10');
            
            // current view already set
            this.progressBarView.update(10);

            this.currentView.options.collection.forEach(function(m) {
                m.step = 10;
            });

            // video
            this.setVideo('s23b');
        },

        goalCheck: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - goal check');

            $('#videoPlayer_wrapper').children().first().remove();
            $('#videoPlayer_wrapper').attr('id', 'videoPlayer');
            
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }
            
            // now the current view is revenues, so we can just adjust from there
            
            // display only the page elements relevant for this page
            $('.step, .new').hide();
            $('.goal-check-page').show();
            $('.sortable').show();
            $('.icon-resize-vertical, .icon-remove').css({'visibility': 'hidden'});
            
            if(this.breakevenPoint === undefined) {
                this.calculateBreakevenPoint();
            } else {
                $('#breakeven').text(this.breakevenPoint);
            }
            
            // since rows are added after the page is rendered, we can't use jQuery to hide
            //  yes, i should be scolded because this is really hacky but...
            //  firefox doesn't support document.styleSheets.addRule, so we can't do that...
            //  append it to the instructions because that is written over normally so we don't have to clean 
            $('.instruction').append($('<style id="revenue-style-hack"> .amount { display: inline-block; } .units { display: inline-block; } .percent { display: none; } .revenue { display: inline-block; } </style>'));
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '11');
            
            // current view already set
            this.progressBarView.update(11);

            this.currentView.options.collection.forEach(function(m) {
                m.step = 11;
            });
        },

        realityCheck: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - reality check');
            
            // TODO this feels like a hack solution, idea is that we shouldn't rebuild revenues here
            if(this.currentView === undefined) {
                this.revenueStreams();
            } else if(this.currentView.options.collection.url != 'api/revenues') {
                this.currentView.clean();
                this.revenueStreams();
            }

            // now the current view is revenues, so we can just adjust from there
            
            // display only the page elements relevant for this page
            $('.step, .new, .heading, .sortable').hide();
            $('.reality-check-page').show();
            
            // hook up the action buttons to go to the correct steps
            $('#next, #prev').attr('data-step', '12');
            
            // current view already set
            this.progressBarView.update(12);

            this.currentView.options.collection.forEach(function(m) {
                m.step = 12;
            });
        },
        
        complete: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - complete');

            if(this.currentView != undefined) {
                this.currentView.clean();
            }
            this.$el.html(this.completeTemplate());
            // TODO why are we going to the next phase here?
            //this.nextPhase();
            this.progressBarView.update(13);
            
            this.currentView.options.collection.forEach(function(m) {
                m.step = 13;
            });

            // video
            this.setVideo('s25');
        },
        
        nextPhase: function(e) {
            if(e) e.preventDefault();
            console.log('one year goal - next phase');
            
            /*
            var that = this;
            var progressBarView = this.progressBarView;

            require(['views/build/idealclient/identifyIdealClient'],
                function (IdealClientPage) {
                    that.buildView = new IdealClientPage({header:'SLAPcenter - Build - Ideal Client', progressBarView: progressBarView});
                    that.buildView.render();
                    return false;
                });
            */


            var that = this;
            var pbv = this.progressBarView;
            var buildModel = this.buildModel;
            console.log(buildModel);

            require(['views/build/idealclient/identifyIdealClient', 'models/idealClient'],
            function(IdealClientPage, IdealClientModel) {     
                var idealClientModel = new IdealClientModel({silent:true});
                idealClientModel.url = 'api/client/0';
                idealClientModel.fetch({silent:true, success:function(m1){
                        idealClientModel.url = 'api/client';
                        console.log(idealClientModel);
                        that.idealClientView = new IdealClientPage({
                            model: idealClientModel,
                                    step: "1",
                                    progressBarView: pbv,
                                    buildModel: buildModel
                                });
                                that.idealClientView.render();
                                return false;
                            }});
            });
        },
        
        render: function () {
            this.$el.html(this.beginTemplate({ header: this.header }));
            return this;
        },

        setVideo: function(file) {
            require(['jwPlayer'], function () {
                jwplayer('videoPlayer').setup({
                    'flashplayer': 'app/swf/player.swf',
                    'file': 'http://slapcenter.com/build/videos/slap_flv/' + file + '_F8_HQ_copy.flv',
                    'frontcolor': 'FFFFFF',
                    'lightcolor': 'FFFFFF',
                    'screencolor': 'FFFFFF',
                    'skin': 'app/js/libs/jwplayer/skins/stijl.zip',
                    'controlbar': 'over',
                    'dock': 'false',
                    'autostart': 'true',
                    'stretching': 'none',
                    'width': '240',
                    'height': '360'
                });
            });
        },
        
        clean: function() {
            //this.undelegateEvents();
            //this.unbind();
            //console.log('cleaning');
        }
    });
    
    return OneYearGoalPage;
});
