
const scoreboard = {
    $scores: document.getElementById('scores'),
    renderScores: function(state) {
        this.$scores.innerText = ''
        for (let level=1; level<11; level++) {
            const $tr = document.createElement('tr');
            const $level = document.createElement('td');
            $level.innerText = level;

            const $time = document.createElement('td');
            const $best = document.createElement('td');
            if (state.scores['level' + level]) {
                let t = state.scores['level' + level].time/1000;
                let b = state.scores['level' + level].best/1000;
                $time.innerText = (t <= 60 && t > 0) ? t.toFixed(3) : '-'
                $best.innerText = (b <= 60 && b > 0) ? b.toFixed(3) : '-';
            }
            else {
                $time.innerText = '-';
                $best.innerText = '-';
            }
            $tr.append($level)
            $tr.append($time)
            $tr.append($best)

            this.$scores.append($tr);
        }
    },
    setScore:function(state, level, time) {
        if (!state.scores['level' + level]) {
            state.scores['level' + level] = {time: time, best:time};
        }
        else {
            state.scores['level' + level].time = time;
            if (!state.scores['level' + level].best
                || time < state.scores['level' + level].best)
            {
                state.scores['level' + level].best = time
            }
        }
    },

    resetScores: function(state) {
        for (let level=1; level<11; level++) {
            this.setScore(state, level, Infinity);
        }
    }
}

export default scoreboard