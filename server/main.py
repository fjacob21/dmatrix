#! /usr/bin/python3
from flask import Flask, jsonify, abort, request, send_from_directory, redirect, url_for
import json
import os

application = Flask(__name__, static_url_path='')

@application.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response

@application.route('/active')
def active():
    return jsonify({"active": True})

@application.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()
    if data is None or 'bitmap' not in data:
        abort(400)

    with open('dmatrix/dmatrix.ino.tmpl', 'r') as f:
        content = f.read();
        content = content.replace('///BITMAP///', data['bitmap'])
    with open('dmatrix/dmatrix.ino', 'w') as f:
        f.write(content)

    res= os.system('arduino --verbose-upload --port /dev/ttyACM0 --upload dmatrix/dmatrix.ino')
    return jsonify({"result":res})

@application.route('/html/<path:path>')
def send_js(path):
    return send_from_directory('../', path)

@application.route('/')
def root():
    return redirect('/html/index.html')

if __name__ == '__main__':
    application.run(debug=True,host='0.0.0.0', port=5000)
