$(document).ready(function(){
    $('.ncorrect').text('0');
    $('.ntot').text('0');
    $('.generate').on('click',function(){
        $('.ncorrect').text('0');
        Utils.getTrivia()
            .then(function(triviaQuestions){
                    $('.questions').empty();
                    return triviaQuestions;
                })
            .then(Utils.formatQuestions)
            .then(Utils.checkAnswer); 
    });
});


