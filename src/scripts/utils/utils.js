var Utils = (function () {
    var correctAnswers = {};

    return {
        "getcareerinfo": function () {
            return [
                { "descriptor": "Org Level/DTE", "text": "Digital Delivery Applied Intelligence" },
                { "descriptor": "Role", "text": "Business Intelligence Analyst" },
                { "descriptor": "Talent Segment", "text": "Business & Technology Integration" },
                { "descriptor": "Career Track", "text": "Client & Market" }
            ];
        },

        "getTrivia": function (type, level, num) {
            var num = $('#num').val();
            var type = $('#question-type').val();
            var level = $('#level').val();
            var category = $('#category').val();
            if (num === '') { num = '10' };
            if (num === '0') {alert('The number of questions must be greater than 0. Try again.')};
            if (+num > 50) {alert('The maximum number of questions is 50. Returning 50 questions.')};
            //console.log('https://opentdb.com/api.php?amount=' + num + '&category=' + category + '&difficulty=' + level + '&type=' + type);
            return $.ajax({
                method: 'GET',
                url: 'https://opentdb.com/api.php?amount=' + num + '&category=' + category + '&difficulty=' + level + '&type=' + type,
                dataType: 'json',
            }).then(function(response){
                // if (response.response_code !== 0) {
                //     alert('An error occurred. Try changing the number of questions you entered, or a less specific request.');
                //     throw 'Error: response returned status of ' + response.status;
                //     return;
                // }
                if (response.response_code == 1){
                    alert('An error occurred. Reduce the number of questions, or try a less specific request.');
                    throw 'Error: response returned status of ' + response.status;
                    return;
                }
                else if (response.response_code == 2){
                    alert('An error occurred. Invalid input.');
                    throw 'Error: response returned status of ' + response.status;
                    return;
                }
                correctAnswers = {};
                //console.log(JSON.stringify(response.results));
                //console.log(response.results);
                return response.results;
            }).then(function(triviaQuestions) {
                var parser = new DOMParser();
                return $.map(triviaQuestions, function (i) {
                    var _this = i;
                    _this.question = parser.parseFromString('<!doctype html><body>' + _this.question,
                        'text/html').body.textContent;
                    _this.correct_answer = parser.parseFromString('<!doctype html><body>' + _this.correct_answer,
                        'text/html').body.textContent;
                    _this.incorrect_answers = $.map(_this.incorrect_answers, function (incorrect) {
                        return parser.parseFromString('<!doctype html><body>' + incorrect, 'text/html').body.textContent;
                    });
                    return _this;
                });
            });
        },

        "formatQuestions": function (triviaQuestions) {
            $.each(triviaQuestions, function (i) {
                var question = $('<span></span>').text(triviaQuestions[i].question).addClass('question');
                var correct = triviaQuestions[i].correct_answer;
                var incorrect = triviaQuestions[i].incorrect_answers;
                incorrect.push(triviaQuestions[i].correct_answer);
                var answers = Utils.shuffleArray(incorrect);
                var li = $('<li></li>');
                var p = $('<p></p>');
                li.append(question);
                $.each(answers, function (j) {
                    var uniqueID = i + '_' + j;
                    if (answers[j] == correct) {
                        correctAnswers['answers_' + i] = answers[j];
                    };
                    p.append('<input type="radio" name="answers_' + i + '" id="' + uniqueID + '" value="' + answers[j] + '"/> <label for="' + uniqueID + '">' + answers[j] + '</label> <br>');
                });
                $('.questions').append(li).append(p);
            });
            num = triviaQuestions.length;
            $('.ntot').text(num);
        },

        "shuffleArray": function (array) {
            var i = 0
                , j = 0
                , temp = null;
            for (i = array.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1));
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },

        "checkAnswer": function () {
            $('input[type="radio"]').change(function () {
                //console.log(this);
                var ncorrect = $('.ncorrect').html();
                if (this.value == correctAnswers[this.name]) {
                    $('label[for=' + this.id + ']').addClass('correct');
                    $('input[name=' + this.name + ']').attr('disabled', 'disabled');
                    ncorrect = +ncorrect + 1;
                    $('.ncorrect').text(ncorrect);
                }
                else {
                    $('label[for=' + this.id + ']').addClass('incorrect');
                    $('input[name=' + this.name + ']').attr('disabled', 'disabled');
                    var parent = $('input[name=' + this.name + ']').parent();
                    var key = this.name;
                    $('label:not(.incorrect)', parent).each(function () {
                        answer = $(this).text();
                        if (answer == correctAnswers[key]) {
                            $(this).addClass('correct');
                        }
                    })
                }
            });
        }
    }
})()
