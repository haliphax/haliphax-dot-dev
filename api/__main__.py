"Entry point for API module for haliphax.dev Eleventy site"

# stdlib
import json
from os import getenv
from os.path import join, realpath
# 3rd party
from dotenv import load_dotenv
from twitch import Helix


def main():
	load_dotenv()

	# settings
	CLIENT_ID = getenv('TWITCH_CLIENT_ID')
	CLIENT_SECRET = getenv('TWITCH_CLIENT_SECRET')
	OUTPUT_DIR = getenv('JSON_OUTPUT_DIR')
	USERNAME = getenv('TWITCH_USERNAME')

	# Twitch API client
	helix = Helix(CLIENT_ID, CLIENT_SECRET)
	me = helix.user(USERNAME)

	with open(join(realpath(OUTPUT_DIR), 'twitch-live.json'), 'w') as out:
		out.write(json.dumps({'live': me.is_live}))


if __name__ == '__main__':
	main()
