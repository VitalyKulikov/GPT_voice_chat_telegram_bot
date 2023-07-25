build:
    docker build -t gpt_voices_bot .

run:
    docker run -d -p 3000:3000 --name gpt_voices_bot --rm gpt_voices_bot