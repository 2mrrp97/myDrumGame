
var drums = document.querySelectorAll('.drum');

// IMP : dont reject promise if element HAS 'hidden' already , , OR the game wont start 
function hide(query) {

    let promise = new Promise((resolve) => {
        var elem = document.querySelector(query);
        if (!elem.classList.contains('hidden')) {
            elem.classList.add('hidden');
            resolve();
        }
        else {
            resolve('RESOLVED'); // resolve here too instead of rejecting promise .
        }
    });
    return promise;
};

// IMP : dont reject promise if element does not have 'hidden' already , OR the game wont start 
function show(query) {

    let promise = new Promise((resolve) => {
        document.querySelector(query).classList.remove('hidden');
        resolve();
    });

    return promise;
}

// WE WANTED THE START GAME EVENTS TO OCCUR ONE AFTER ANOTHER SO WE MAKE THIS CALLBACK AN ASYNC FUNCTION
startBtn.addEventListener('click', async function () {
    try {
        await hide('#startBtn');
        await hide('#gameOverMssg');
        await show('#score');
        start_game();
    }
    catch (err) {
        console.error(err);
    }
});



// game function 
function start_game() {
    let n = drums.length;
    let score = 0, penalty = 0;
    let lastIndex = -1;

    // reset the scores and penalties from prev games (If set);
    document.querySelector("#score #penalty span").textContent = 0;
    document.querySelector("#score #sc span").textContent = 0;

    // game loop 
    let game = setInterval(async () => {

        drums.forEach(e => e.classList.remove('red'));

        var index = 0;
        // this loop prevents same drum from being used two time consecutively 
        while (index == lastIndex) {
            index = Math.floor(Math.random() * n);
        }

        var curr_drum = drums[index];
        var drumKey = curr_drum.textContent;

        curr_drum.classList.add('red');
        let cnt_mouse_event = 0, cnt_key_event = 0;
        let clicked = undefined;


        // only listen to the first mouse click event 
        drums.forEach(e => {
            e.addEventListener('click', () => {
                cnt_mouse_event++;
                if (cnt_mouse_event == 1 && e.textContent == drumKey) {
                    clicked = true;
                }
            });
        });


        // only listen to the first key press event 
        document.addEventListener('keydown', (event) => {
            cnt_key_event++;
            var key = event['key'].charAt(0).toLowerCase();
            if (cnt_key_event == 1 && key == drumKey) {
                clicked = true;
            }
        });

        lastIndex = index; // set last index as current index .

        // fire this after 1.4 s , give user time to press keys / click mouse .
        let over = setTimeout(() => {
            if (clicked == undefined) {
                penalty++;
                document.querySelector("#score #penalty span").textContent = penalty;
                if (penalty == 3) {
                    show('#gameOverMssg');
                    show('#startBtn');
                    clearInterval(game); // stop the game loop .
                }
            }
            else {
                document.querySelector("#score #sc span").textContent = ++score;
            }

        }, 1400)

    }, 1500);

};


const dataset_id_mapping = {
    w: "1",
    a: "2",
    s: "3",
    d: "4",
    j: "5",
    k: "6",
    l: "7"
};


// for generic mouse click events before/after/during game , plays the audio
drums.forEach(element => {
    element.addEventListener('mousedown', () => {
        var audio = new Audio(`./sounds/${element.dataset.id}.mp3`);
        audio.play();
        element.classList.add('pressed');
    });

    element.addEventListener('mouseup', () => {
        element.classList.remove('pressed');
    });
});


// for generic key board events before/after/during game , plays the audio
document.addEventListener('keydown', (event) => {
    var key = event['key'].charAt(0).toLowerCase();
    document.querySelector(`.${key}`).classList.add('pressed');
    var audio = new Audio(`./sounds/${dataset_id_mapping[key]}.mp3`);
    audio.play();
});

document.addEventListener('keyup', (event) => {
    var key = event['key'].charAt(0).toLowerCase();
    document.querySelector(`.${key}`).classList.remove('pressed');
});

