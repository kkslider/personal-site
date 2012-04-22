$(document).ready(function () {
    // http://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
    'use strict';

    var data = {}, header = {}, summary = {}, content = {}, footer = {}, template, html;

    header = {
        name: 'Tom Stapleton',
        action: '<a href="mailto:tstapleton@gmail.com">Email Me</a>',
        slogan: '...is an interface designer and front-end developer on a journey to establish the importance of design in enterprise applications.  Because even though our users <strong>have</strong> to use our applications, it doesn\'t mean that they shouldn\'t <strong>want</strong> to also.',
        areas: {
            intro: 'I\'m proud to have experience with:',
            items: [
                {
                    id: 2,
                    name: 'Education'
                },
                {
                    id: 5,
                    name: 'Data Analysis'
                },
                {
                    id: 6,
                    name: 'Design'
                },
                {
                    id: 7,
                    name: 'Development'
                },
                {
                    id: 8,
                    name: 'Drupal'
                },
                {
                    id: 3,
                    name: 'Leadership'
                },
                {
                    id: 1,
                    name: 'Shopify'
                },
                {
                    id: 4,
                    name: 'Teaching'
                }
            ]
        }
    };

    footer = {
        items: [
            'Elsewhere on the web at <a href="https://github.com/tstapleton">GitHub</a>, <a href="http://www.linkedin.com/in/thomasstapleton">LinkedIn</a>, and <a href="https://twitter.com/thomasstapleton">Twitter</a>.',
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
                        position: 'Web Developer',
                        company: 'Baker Hughes',
                        period: 'July 2011 - Present'
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
                        image: '../images/resume.png',
                        teaser: 'Created a project to learn new ideas in web development and build a website that highlights my experiences',
                        tags: [2, 6, 7],
                        more: true,
                        details: [
                            'I built this website to highlight my accomplishments in a more interesting way than a traditional resume',
                            'Learn more about the project and what I learned while doing it in <a href="/project">The Project</a> section',
                            'All source code is available on <a href="https://github.com/tstapleton/personal-site">GitHub</a>'
                        ]
                    },
                    {
                        image: '../images/mockup.png',
                        teaser: 'Identified the need for a user interface designer and took the role',
                        tags: [6, 7, 3, 4],
                        more: true,
                        details: [
                            'Identified the lack of user interface design in our current processes and the issues it was causing like gaps between what the business wanted and the solution developed, and inconsistent interface patterns throughout the application',
                            'Set the expectation that screen mockups should be developed and approved by the business prior to development so a common understanding could be established early',
                            'Started developing a front-end pattern library to establish standard and reusable ways of interacting with the application'
                        ]
                    },
                    {
                        image: '../images/burndown.png',
                        teaser: 'Advocated for the adoption of agile processes and quickly became scrum master',
                        tags: [3, 4],
                        more: true,
                        details: [
                            'Reading <a href="http://www.amazon.com/User-Stories-Applied-Software-Development/dp/0321205685"><em>User Stories Applied</em> by Mike Cohn</a> a couple years ago was eye-opening and convinced me of the benefits of agile software development and user stories',
                            'I started teaching the ideas to my business partner with <a href="http://3pointzero.org">3.ZERO</a> to improve execution, planning and communication and the clients were impressed with our organization, communication and frequent deliverables',
                            'When our team at Baker Hughes had the opportunity to start doing scrums, I stepped up to the opportunity, learning from our first scrum master and quickly took over the role for the team',
                            'Now my responsibilities as scrum master include organizing the planning meetings, leading the daily stand ups, working with the business analysts to write the user stories, and guiding our transition away from our previous waterfall methods'
                        ]
                    },
                    {
                        image: '../images/cbm.png',
                        teaser: 'Redesigned a complex process by simplifying input and introducing result visualization',
                        tags: [6, 7, 3, 5],
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
                        image: '',
                        teaser: 'Designed and developed our website to showcase projects and attract new clients',
                        tags: [6, 7, 8],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Developed a mapping site to visualize travel schedules for better planning and communication',
                        tags: [6, 7, 8, 3, 5],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Built a website that allows a retail store to expand their business and easily manage their complex product categorizations',
                        tags: [6, 7, 1],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Setup a team wiki to start building a knowledge base for better communication and sharing',
                        tags: [2, 7, 3, 4],
                        more: false,
                        details: []
                    }
                ]
            },
            {
                title: '2008 - 2010',
                items: [
                    {
                        image: '',
                        teaser: 'Built a website focused on detail and clarity to match the spiritual traditions represented by the products',
                        tags: [6, 7, 1],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Organized and delivered education classes and application deployments in Europe, Asia, Africa and North America',
                        tags: [4],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Developed an influencer marketing solution that allows industry pioneers to communicate the brand’s message',
                        tags: [6, 7, 8, 4],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Designed reusable educational materials to enable teachers to assess student learning in real-time',
                        tags: [7, 3, 4],
                        more: false,
                        details: []
                    }
                ]
            },
            {
                title: '2007',
                items: [
                    {
                        image: '',
                        teaser: 'Earned bachelor degrees in computer science and finance, and a minor in applied mathematics from the University of Colorado',
                        tags: [2, 7, 5],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Earned a certificate in quantitative finance, a program focused on analytical problem solving across disciplines',
                        tags: [2, 5],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Implemented a peer-to-peer file distribution system with a centralized server',
                        tags: [2, 7, 3, 4],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Used support vector machines to predict future stock market movements',
                        tags: [2, 7, 5],
                        more: false,
                        details: []
                    }
                ]
            },
            {
                title: '2003 - 2006',
                items: [
                    {
                        image: '',
                        teaser: 'Managed the student union’s $400,000 yearly budget',
                        tags: [3, 4],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Led 60 brothers in defining and adopting Expectations of Membership to turn around a struggling Chapter',
                        tags: [3, 4],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Introduced accounting transparency of the $100,000 yearly budget to double collection rates and pay off debt',
                        tags: [3, 5],
                        more: false,
                        details: []
                    },
                    {
                        image: '',
                        teaser: 'Created a business plan, marketing materials and a website for my first entrepreneurial project',
                        tags: [2, 6],
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

    template = $('#content').html();
    html = Mustache.to_html(template, data);
    $('#content').html(html).show();

});
