/*jslint browser: true*/
/*global $, jQuery, Mustache, console*/

$(document).ready(function () {
    // http://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
    'use strict';

    var data = {}, header = {}, summary = {}, content = {}, footer = {}, imageSize, template, html;

    // define image size to load based on screen size
    // phone sizes should get small for narrow 1 column, screen.width <= 500 - 414
    // narrow tablets could get larger image to account for wide 1 column, screen.width > 500 && screen.width < 768 - 633
    // large screen should get small for 2 or 4 columns, screen.width >= 768 - 414px
    imageSize = (screen.width > 500 && screen.width < 768) ? '_large.jpg' : '_small.jpg';

    header = {
        name: 'Tom Stapleton',
        action: '<a href="mailto:tstapleton@gmail.com">Email Me</a>',
        slogan: '...is an interface designer and front-end developer on a journey to establish the importance of design in enterprise applications.  Because even though our users <strong>have</strong> to use our applications, it doesn\'t mean that they shouldn\'t <strong>want</strong> to also.',
        areas: {
            intro: 'I have experience with:',
            items: [
                {
                    id: 'B',
                    name: 'Education'
                },
                {
                    id: 'U',
                    name: 'Data Analysis'
                },
                {
                    id: 'w',
                    name: 'Design'
                },
                {
                    id: 'G',
                    name: 'Development'
                },
                {
                    id: 'Y',
                    name: 'Drupal'
                },
                {
                    id: 'f',
                    name: 'Leadership'
                },
                {
                    id: 't',
                    name: 'Shopify'
                },
                {
                    id: 'b',
                    name: 'Teaching'
                }
            ]
        },
        toc: {
            intro: 'I used this project as an opportunity to learn about new ideas in web design, and hopefully these sections will demonstrate a bit about how I solve problems.',
            items: [
                {
                    name: 'Project Definition',
                    url: '/project'
                },
                {
                    name: 'Research and Assessment',
                    url: 'research.html'
                },
                {
                    name: 'Content Strategy',
                    url: 'content.html'
                },
                {
                    name: 'Design Process',
                    url: 'design.html'
                },
                {
                    name: 'Mobile First',
                    url: 'mobile.html'
                },
                {
                    name: 'Responsive Framework',
                    url: 'responsive.html'
                }
            ]
        }
    };

    footer = {
        items: [
            'Elsewhere on the web at <a href="https://github.com/tstapleton">GitHub</a>, <a href="http://www.linkedin.com/in/thomasstapleton">LinkedIn</a>, <a href="https://twitter.com/thomasstapleton">Twitter</a>, and <a href="https://alpha.app.net/tstapleton">App.net</a>.',
            'Kicking it old school?  Here\'s a PDF version of my <a href="/files/Tom-Stapleton-Resume.pdf">resume</a>.',
            'Built with the <a href="http://fluidbaselinegrid.com/">Fluid Baseline Grid</a>, icons from <a href="http://pictos.cc/">Pictos</a>, and the <a href="http://www.google.com/webfonts/specimen/Lato">Lato</a> font family.  Site hosted at <a href="http://macminicolo.net/">Mac Mini Colo</a> and source code available at <a href="https://github.com/tstapleton/personal-site">GitHub</a>.'
        ]
    };

    summary = {
        section: [
            {
                title: 'Work',
                items: [
                    {
                        position: 'Designer',
                        company: 'Clevertech',
                        period: 'May 2012 - January 2013'
                    },
                    {
                        position: 'Web Developer',
                        company: 'Baker Hughes',
                        period: 'July 2011 - May 2012'
                    },
                    {
                        position: 'Global Product Champion',
                        company: 'Baker Hughes',
                        period: 'October 2008 - July 2011'
                    },
                    {
                        position: 'Developer',
                        company: 'American Airlines',
                        period: 'July 2007 - October 2008'
                    },
                    {
                        position: 'Software Engineer',
                        company: 'Infosys Technologies',
                        period: 'July 2007 - Present'
                    },
                    {
                        position: 'Designer and Developer',
                        company: '3.ZERO',
                        period: 'October 2009 - February 2012'
                    },
                    {
                        position: 'Web Developer',
                        company: 'Jesse Walker Knit Goods',
                        period: 'May 2005 - December 2005'
                    },
                    {
                        position: 'Data Analyst',
                        company: 'Smith Breeden',
                        period: 'March 2005 - May 2005'
                    }
                ]
            },
            {
                title: 'Education',
                items: [
                    {
                        degrees: 'Bachelor degrees in <strong>Computer Science</strong> and <strong>Finance</strong> with a minor in <strong>Applied Mathematics</strong>',
                        company: 'University of Colorado at Boulder',
                        period: 'May 2007'
                    },
                    {
                        position: 'President, Vice President, Treasurer, Member',
                        company: 'Phi Kappa Psi',
                        period: 'August 2002 - May 2007'
                    },
                    {
                        position: 'Finance Director',
                        company: 'University of Colorado Student Union',
                        period: 'June 2005 - May 2006'
                    },
                    {
                        position: 'Treasurer',
                        company: 'Interfraternity Council',
                        period: 'December 2004 - December 2005'
                    }
                ]
            }
        ]
    };

    content = {
        section: [
            {
                title: '2012',
                items: [
                    {
                        image: 'images/abi' + imageSize,
                        teaser: 'Brought related data to light in a redesign of a press release management application',
                        tags: ['w', 'G', 'f'],
                        more: true,
                        details: [
                            'ABI, a global B2B PR marketing and public relations firm, needed a new application to help them manage their work securing placements and their growing customer and media outlet contacts',
                            'I met with employees to understand their current workflow and feature requests, and learned that they had difficulty seeing related data and many common tasks took too many steps to complete',
                            'I designed functional mockups in HTML/CSS/JS that presented related data so the user had it available without leaving their current task and provided context-sensitive shortcuts that made working in the application faster and easier'
                        ]
                    },
                    {
                        image: 'images/idt' + imageSize,
                        teaser: 'Analyzed existing data and workflow to help build a custom inventory management application',
                        tags: ['U', 'w', 'f', 'b'],
                        more: true,
                        details: [
                            'Ideal Diamond Trading needed an inventory management application to handle the workflow of producing jewelry and provide reports to understand inventory and forecast needs',
                            'I reviewed source files to identify the needed entities for the new application, and defined attributes, statuses, and business rules of each entity',
                            'I created wireframes to represent how the user would interact with the new application and make sure all scenarios were accounted for',
                            'I handled data migration and cleaning from various Excel files into the consistent format needed'
                        ]
                    },
                    {
                        image: 'images/pv' + imageSize,
                        teaser: 'Managed a team of 3 in creating a minimal viable product in 30 days of a financial registry website',
                        tags: ['w', 'f'],
                        more: true,
                        details: [
                            'The guys from Present Value had an idea for an event registry website focused on collecting money for registrants to reach their financial goals',
                            'I managed the development process using 4 week-long iterations, daily calls with the developers to stay on track and clear blocks, and daily calls with the client to keep priorities aligned and progress transparent',
                            'It was a daily struggle to provide maximum value for the clients while still maintaining clear expectations and releasing by the planned due date'
                        ]
                    },
                    {
                        image: 'images/slap' + imageSize,
                        teaser: 'Designed and developed a business planning application to improve usability and performance',
                        tags: ['w', 'G', 'f'],
                        more: true,
                        details: [
                            'Silver Lining needed a redesign of their web app that helps small businesses set goals and create plans to achieve their goals',
                            'Review of their previous site showed inconsistent design elements, unintuitive controls for adding and editing content, and an aging site architecture',
                            'I created design components that could be reused throughout the site for a consistent UI and created functional mockups in HTML/CSS/JS using modern technologies like drag and drop, CSS3, font icons',
                            'I lead a team of developers in implementing the mockups using backbone.js communicating with a backend Yii application'
                        ]
                    },
                    {
                        image: 'images/resume' + imageSize,
                        teaser: 'Created a project to learn new ideas in web development and build a website that highlights my experiences',
                        tags: ['B', 'w', 'G'],
                        more: true,
                        details: [
                            'I built this website to highlight my accomplishments in a more interesting way than a traditional resume',
                            '<a href="/project">Learn more</a> about how I am using the project as an opportunity to learn about new ideas in web design and demonstrate a bit about how I solve problems',
                            'All source code is available on <a href="https://github.com/tstapleton/personal-site">GitHub</a>'
                        ]
                    },
                    {
                        image: 'images/mockup' + imageSize,
                        teaser: 'Identified the need for a user interface designer and took the role',
                        tags: ['w', 'G', 'f', 'b'],
                        more: true,
                        details: [
                            'I identified the lack of user interface design in our current processes and the issues it was causing like gaps between what the business wanted and the solution developed, and inconsistent interface patterns throughout the application',
                            'I set the expectation that screen mockups should be developed and approved by the business prior to development so a common understanding could be established early',
                            'I started developing a front-end pattern library to establish standard and reusable ways of interacting with the application'
                        ]
                    },
                    {
                        image: 'images/burndown' + imageSize,
                        teaser: 'Advocated for the adoption of agile processes and quickly became scrum master',
                        tags: ['f', 'b'],
                        more: true,
                        details: [
                            'Reading <a href="http://www.amazon.com/User-Stories-Applied-Software-Development/dp/0321205685"><em>User Stories Applied</em> by Mike Cohn</a> a couple years ago was eye-opening and convinced me of the benefits of agile software development and user stories',
                            'I started teaching the ideas to my business partner with <a href="http://3pointzero.org">3.ZERO</a> to improve execution, planning and communication and the clients were impressed with our organization, communication and frequent deliverables',
                            'When our team at Baker Hughes had the opportunity to start doing scrums, I stepped up to the opportunity, learning from our first scrum master and quickly took over the role for the team',
                            'Now my responsibilities as scrum master include organizing the planning meetings, leading the daily stand ups, working with the business analysts to write the user stories, and guiding our transition away from our previous waterfall methods'
                        ]
                    },
                    {
                        image: 'images/cbm' + imageSize,
                        teaser: 'Redesigned a complex process by simplifying input and introducing result visualization',
                        tags: ['w', 'G', 'f', 'U'],
                        more: true,
                        details: [
                            'Condition based maintenance is a way to recommend maintenance on equipment based on the environment the equipment was used in, e.g. a tool used in a high temperature, high pressure environment needs more maintenance than one used in a low temperature, low pressure environment',
                            'The original process asked the user to input information across 5 screens, remember information across all screens, define buckets for the measured values, mentally combine the buckets to determine the final maintenance, then test the setup by adding the calculations',
                            'This process was very difficult for a new user to understand, and for an experienced user to get correct across many possible environment',
                            'I thought the process could be better understood by introducing graphs and an interactive interface to adjust the inputs'
                        ]
                    }
                ]
            },
            {
                title: '2011',
                items: [
                    {
                        image: 'images/studio' + imageSize,
                        teaser: 'Designed and developed our website to showcase projects and attract new clients',
                        tags: ['w', 'G', 'Y'],
                        more: true,
                        details: [
                            'After completing a number of client projects, our digital design studio, <a href="http://3pointzero.org">3.ZERO</a>, needed a new website to host our portfolio and explain our new focus',
                            'The site was built on Drupal 7 with the Context, Feeds, Nodequeue, Services, Views, and Webform modules, and a custom subtheme based on Omega',
                            'It was a great opportunity to learn about iterative development, project management, content organization for effective communication and continued management, and the new Drupal core and modules'
                        ]
                    },
                    {
                        image: 'images/deployment' + imageSize,
                        teaser: 'Developed a mapping site to visualize travel schedules for better planning and communication',
                        tags: ['w', 'G', 'Y', 'f', 'U'],
                        more: true,
                        details: [
                            'As a lead on the deployment team for an enterprise application, I was helping to plan the global travel schedules for our educators for the upcoming year',
                            'We compiled the geographical information into a spreadsheet, assigned educators and deployment dates to each location, and setup filters on the columns to try to make sense of the plan',
                            'After struggling to really understand the data as a series of rows, I decided that a map would be a better way to visual the plans',
                            'I used Drupal 6 with OpenLayers, Feeds, Taxonomy Views and Better Exposed Filters to create a site where we could import our planning spreadsheet and visualize the schedule on a world map across many educators, dates, regions and product lines',
                            'The map allowed us to better review our schedule and communicate the plans to external teams'
                        ]
                    },
                    {
                        image: 'images/bettylin' + imageSize,
                        teaser: 'Built a website that allows a retail store to expand their business and easily manage their complex product categorizations',
                        tags: ['w', 'G', 't'],
                        more: true,
                        details: [
                            'We had built a few Shopify themes before we started working with <a href="http://bettylinseattle.com">Betty Lin</a> and we knew right away that the project was going to require a lot of smart customizations and setup to make their store easy to manage long-term',
                            'I led the discovery phase and helped them plan their product taxonomy from the start so we could provide their users with many ways to find the perfect item while reducing manual product management as much as possible',
                            'The theme relies heavily on the Liquid template language and JavaScript to build the navigation, breadcrumbs, pagination and various product viewing features'
                        ]
                    },
                    {
                        image: 'images/wiki' + imageSize,
                        teaser: 'Setup a team wiki to start building a knowledge base for better communication and sharing',
                        tags: ['B', 'G', 'f', 'b'],
                        more: true,
                        details: [
                            'When I switched from the process team to the development team, it quickly became apparent that there wasn\'t a central place to store team knowledge, which made on-boarding a new developer very difficult and knowledge sharing not repeatable',
                            'I tested a few open source wiki solutions and settled on <a href="http://www.dokuwiki.org/dokuwiki">DokuWiki</a>, then applied some custom styles, configured LDAP for user access, and set up a navigation hierarchy with tagging conventions',
                            'I started adding content to the site as I learned something new, and we eventually used the wiki to define and store team coding standards, collect useful code snippets, publish accepted procedures, and store meeting notes'
                        ]
                    }
                ]
            },
            {
                title: '2008 - 2010',
                items: [
                    {
                        image: 'images/prettybird' + imageSize,
                        teaser: 'Built a website focused on detail and clarity to match the spiritual traditions represented by the products',
                        tags: ['w', 'G', 't'],
                        more: true,
                        details: [
                            '<a href="http://www.hereprettybird.com">Pretty Bird</a> offers spiritual, hand-made jewelry and needed a Shopify theme built that would communicate the same messages as their products',
                            'The clean lines, shades of light gray, use of white space, and touches of color combine to put the focus on the products and give the site a calming feel',
                            'I collaborated with the designer to produce the final PSDs, then implemented the theme using HTML, CSS, JavaScript and the Liquid template language'
                        ]
                    },
                    {
                        image: 'images/map' + imageSize,
                        teaser: 'Organized and delivered education classes and application deployments in Europe, Asia, Africa and North America',
                        tags: ['b'],
                        more: true,
                        details: [
                            'In the first month at my new position, I learned all I could about our asset tracking application and enough about the oil and gas industry and the company\'s workshop procedures to put everything in context',
                            'Then I was off to Norway to give my first training class and implement the application into their workflow, while shadowing from an existing educator',
                            'A couple weeks after that, I was on my own, contacting locations across the globe to convince them of the benefits of the application, schedule implementation dates, conduct the classes and provide continued support',
                            'The most challenging part was encouraging change to a resistant audience who had years of experience working with physical documents and local procedures'
                        ]
                    },
                    {
                        image: 'images/pioneers' + imageSize,
                        teaser: 'Developed an influencer marketing solution that allows industry pioneers to communicate the brand’s message',
                        tags: ['w', 'G', 'Y', 'b'],
                        more: true,
                        details: [
                            'Topo Ranch wanted to drive more traffic and revenue to their existing online store while communicating their brand story',
                            'We developed a solution where Topo Ranch could identify leaders in the art, fine food, music and green communities, and provide them with a place to tell their own story, released as <a href="http://pioneers.toporanch.com">Topo Ranch Pioneers</a>',
                            'The site delivered authentic storytelling and entertainment from the industry pioneer to the customer, and naturally integrated Topo Ranch\'s products to built traffic to their online store'
                        ]
                    },
                    {
                        image: 'images/lego' + imageSize,
                        teaser: 'Designed reusable educational materials to enable teachers to assess student learning in real-time',
                        tags: ['G', 'f', 'b'],
                        more: true,
                        details: [
                            'Between deployments, I continually updated the educational materials based on what I learned from teaching the classes and researching about how people learn',
                            'Setup for the classes was difficult because I was always digging around the application to find good data examples for the students to perform exercises on, which varied from student to student',
                            'I designed a set of training examples that demonstrated everything I wanted to teach, created a unique and repeatable numbering scheme to sandbox each student\'s examples, and wrote SQL scripts to reset the data after each class so each student could start from the same place',
                            'I made an assumption that most workshop technicians were kinesthetic learners since they work with their hands all day, and I bought LEGO blocks for each student that would mirror the application exercises in the class with something physically manipulatable'
                        ]
                    }
                ]
            },
            {
                title: '2007',
                items: [
                    {
                        image: 'images/graduation' + imageSize,
                        teaser: 'Earned bachelor degrees in computer science and finance, and a minor in applied mathematics from the University of Colorado',
                        tags: ['B', 'G', 'U'],
                        more: true,
                        details: [
                            'I began college pursuing a major in computer science and quickly realized that business classes would be valuable, so I decided to pursue a minor in business administration during the summers',
                            'I was highly successful and interested in Introduction to Accounting and Introduction to Finance, so I decided to purse a dual major in computer science and finance',
                            'The Quantitative Finance Certificate program was introduced in my junior year, and to fulfill those requirements, I would have been 1 class short of a minor in applied mathematics, so I decided to take the extra class as well',
                            'In the end, I earned dual bachelor degrees in computer science and finance with a minor in applied mathematics, and graduated with a cumulative GPA of 3.44'
                        ]
                    },
                    {
                        image: 'images/quant' + imageSize,
                        teaser: 'Earned a certificate in quantitative finance, a program focused on analytical problem solving across disciplines',
                        tags: ['B', 'U'],
                        more: true,
                        details: [
                            '<a href="http://www.colorado.edu/asqf/">The Actuarial Studies and Quantitative Finance Certificate Program</a> was designed to bridge the gap between quantitative studies and finance, with a focus on learning the ability to perform complex financial analysis',
                            'The curriculum combined advanced classes in applied mathematics, finance and economics, and prepared "some of the top students at the University" for a variety of industries',
                            'I was lucky to have naturally been taking the necessary classes when the program was introduced, then earned the certificate and graduated with a GPA of 3.712 for the relevant coursework'
                        ]
                    },
                    {
                        image: 'images/distribustream' + imageSize,
                        teaser: 'Implemented a peer-to-peer file distribution system with a centralized server',
                        tags: ['B', 'G', 'f', 'b'],
                        more: true,
                        details: [
                            'As a team senior project for computer science, we worked with a Boulder-based startup focused on the syndicated distribution of on-demand media',
                            'The company wanted to reduce bandwidth costs and increase scalability by moving from a traditional network model of many clients streaming data off a single server to a peer-to-peer distribution system',
                            'We designed and implemented a solution, <a href="https://github.com/tarcieri/DistribuStream">DistribuStream</a>, that behaves like a P2P network with a centralized server where file transfer speeds and file availability increase as the number of clients increase, while maintaining control of content distribution by the server',
                            'My role for the project was team lead where I focused on requirements, team management, testing and project delivery'
                        ]
                    },
                    {
                        image: 'images/svm' + imageSize,
                        teaser: 'Used support vector machines to predict future stock market movements',
                        tags: ['B', 'G', 'U'],
                        more: true,
                        details: [
                            'The aim of the project was to research support vector machines and build a program in Matlab to use SVMs in financial time-series forecasting',
                            'Historical financial data of major stock market indexes was collected and divided into 6 overlapping training-validation-testing data sets',
                            'After a first attempt using actual weekly closing prices failed, decided to reclassify data and use percent change in weekly closing prices and a classifier to represent positive or negative direction change',
                            'In the end, even predicting the direction of change from one week to another proved difficult as demonstrated with the testing accuracy ranging from 35.8% to 61.5%'
                        ]
                    }
                ]
            },
            {
                title: '2003 - 2006',
                items: [
                    {
                        image: 'images/ucsu' + imageSize,
                        teaser: 'Managed the student union’s $400,000 yearly budget',
                        tags: ['f', 'b'],
                        more: false,
                        details: []
                    },
                    {
                        image: 'images/president' + imageSize,
                        teaser: 'Led 60 brothers in defining and adopting Expectations of Membership to turn around a struggling Chapter',
                        tags: ['f', 'b'],
                        more: false,
                        details: []
                    },
                    {
                        image: 'images/treasurer' + imageSize,
                        teaser: 'Introduced accounting transparency of the $100,000 yearly budget to double collection rates and pay off debt',
                        tags: ['f', 'U'],
                        more: false,
                        details: []
                    },
                    {
                        image: 'images/studentsolutions' + imageSize,
                        teaser: 'Created a business plan, marketing materials and a website for my first entrepreneurial project',
                        tags: ['B', 'w'],
                        more: false,
                        details: []
                    }
                ]
            }
        ]
    };

    data = {
        header: header,
        summary: summary,
        content: content,
        footer: footer
    };

    $.get('../template/experience.html', function (template) {
        html = Mustache.to_html(template, data);
        $('#experience').html(html);
        $('.separator hr').css('opacity', 1);
    });

    $.get('../template/footer.html', function (template) {
        html = Mustache.to_html(template, data);
        $('footer').html(html);
    });

    $.get('../template/header.html', function (template) {
        html = Mustache.to_html(template, data);
        $('header').html(html);
    });

    $.get('../template/summary.html', function (template) {
        html = Mustache.to_html(template, data);
        $('#summary').html(html);
        $('.separator hr').css('opacity', 1);
    });

    $.get('../template/toc.html', function (template) {
        html = Mustache.to_html(template, data);
        $('#toc').html(html);
        $('.separator hr').css('opacity', 1);
    });

});
