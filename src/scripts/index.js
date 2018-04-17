$(document).ready(function(){
    $('.generate').on('click',function(){
        Utils.getTrivia()
            .then(function(triviaQuestions){
                    $('.questions').empty();
                    return triviaQuestions;
                })
            .then(Utils.formatQuestions)
            .then(Utils.checkAnswer); 
    });
});


