build:
	docker build -t gpt_chat_voices .
run:
	docker run -d -p 3000:3000 --name gpt_chat_voices --rm gpt_chat_voices