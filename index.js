#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from 'figlet';
import gradient from 'gradient-string';
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randomNumberMaxLimit = 3;
const pointRate = 5;
let gameLogs = {
    round: 1,
    earned_points: 0
};
async function askRandomNumberQuestion(min, max) {
    let randomNumber = random(min, max);
    console.log(chalk.bgBlueBright(`\n> Round ${gameLogs.round} (${gameLogs.earned_points} Points)`));
    let answer = await inquirer.prompt({
        name: 'guessed_number',
        type: 'input',
        message: `Guess Number between ${min} & ${max}`,
        validate: (answer) => {
            let userAnswer = parseInt(answer);
            if (isNaN(userAnswer))
                return 'please enter a number';
            if (userAnswer < min || userAnswer > max)
                return `please guess the number between (${min}, ${max})`;
            return true;
        }
    });
    if (randomNumber == answer.guessed_number) {
        let earnedPoints = pointRate * gameLogs.round;
        console.log(chalk.greenBright(`You guessed the correct number`));
        console.log(chalk.blueBright(`You cleared Round ${gameLogs.round++} & earned ${earnedPoints} points\n`));
        gameLogs.earned_points += earnedPoints;
    }
    else {
        console.log(chalk.redBright(`Sorry, you guessed the wrong number`));
        console.log(chalk.yellowBright(`The correct answer is ${randomNumber}\n`));
    }
    await askForNextRound()
        ? askRandomNumberQuestion(1, randomNumberMaxLimit * gameLogs.round)
        : gameOver(chalk.bgBlueBright(`\n> You are at Round ${gameLogs.round} & you have (${gameLogs.earned_points} Points)`));
}
askRandomNumberQuestion(1, randomNumberMaxLimit);
async function askForNextRound() {
    let answer = await inquirer.prompt({
        name: 'is_continue',
        type: 'list',
        message: 'Do you want continue',
        choices: ['Yes', 'No']
    });
    return answer.is_continue == 'Yes';
}
async function gameOver(message) {
    figlet('Game Over', (error, data) => {
        console.log(gradient.pastel.multiline(data));
    });
    console.log(message);
}
