import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import triviaAPI from '../services/triviaAPI';
import { userPerformance } from '../Redux/action';
import Header from '../components/Header';
import '../css/Game.style.css';

const INITIAL_STATE = {
  questions: {},
  questionIndex: 0,
  loading: true,
  answerBtns: {
    myAnswer: false,
    isDisabled: false,
  },
  timer: 30000,
  score: 0,
};
class Game extends Component {
  state = INITIAL_STATE;

  async componentDidMount() {
    const { history } = this.props;
    const token = localStorage.getItem('token');
    const questions = await triviaAPI(token);

    if (!questions.length) {
      localStorage.removeItem('token');
      history.push('/');
    }
    this.setState({ questions, loading: false });
  }

  shuffleArray = (array) => {
    const SHUFFLE_NUMBER = 0.5;
    return array.sort(() => Math.random() - SHUFFLE_NUMBER);
  };

  setDifficulty = () => {
    const { questions, questionIndex } = this.state;
    const difficultyList = {
      easy: 1,
      medium: 2,
      hard: 3,
    };
    return difficultyList[questions[questionIndex].difficulty];
  };

  clickAnswerHandler = ({ target }) => {
    const { score } = this.state;
    const { setUserPerformance } = this.props;
    const base = 10;
    this.setState(() => ({
      answerBtns: {
        myAnswer: true,
        isDisabled: true,
      },
    }));
    if (target.name === 'correctAnswer') {
      const timer = document.getElementById('timer').innerHTML;
      const upScore = base + (timer * this.setDifficulty());
      this.setState({
        score: score + upScore,
      }, () => setUserPerformance(this.state));
    }
  };

  getIncorrectAnswers = () => {
    const {
      questions,
      questionIndex, answerBtns: { myAnswer, isDisabled }, timer } = this.state;
    const { incorrect_answers: incorrectAnswers } = questions[questionIndex];

    return incorrectAnswers.map((answer, index) => (
      <button
        key={ index }
        type="button"
        data-testid={ `wrong-answer-${index}` }
        className={ (myAnswer) ? 'wrong__answer' : '' }
        onClick={ this.clickAnswerHandler }
        disabled={ isDisabled || !timer }
      >
        {answer}
      </button>
    ));
  };

  getCorrectAnswer = () => {
    const {
      questions,
      questionIndex, answerBtns: { myAnswer, isDisabled }, timer } = this.state;
    const { correct_answer: correctAnswer } = questions[questionIndex];
    return (
      <button
        key={ 4 }
        type="button"
        data-testid="correct-answer"
        name="correctAnswer"
        className={ (myAnswer) ? 'correct__answer' : '' }
        onClick={ this.clickAnswerHandler }
        disabled={ isDisabled || !timer }
        // id="correct"
      >
        {correctAnswer}
      </button>
    );
  };

  createArrayOfAnswers = () => {
    const arrayOfAnswers = [...this.getIncorrectAnswers(), this.getCorrectAnswer()];
    return this.shuffleArray(arrayOfAnswers);
  };

  timerCountdownHandler = () => {
    const ONE_SECOND_COUNTER = 1000;
    const { timer } = this.state;
    const setTimer = setTimeout(() => {
      this.setState({ timer: timer - ONE_SECOND_COUNTER });
    }, ONE_SECOND_COUNTER);
    if (!timer) {
      clearTimeout(setTimer);
    }
  };

  render() {
    const { loading, questions, questionIndex, timer } = this.state;
    this.timerCountdownHandler();
    return (
      <div>
        { loading && <p> Loading... </p> }
        {!loading
        && (
          <div>
            <Header />
            <div>
              <h3 id="timer">{ timer }</h3>
              <p data-testid="question-category">
                {questions[questionIndex].category}
              </p>
            </div>

            <p data-testid="question-text">
              {questions[questionIndex].question}
            </p>

            <div data-testid="answer-options">
              {this.createArrayOfAnswers()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  setUserPerformance: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setUserPerformance: (performanceData) => dispatch(userPerformance(performanceData)),
});

export default connect(null, mapDispatchToProps)(Game);
