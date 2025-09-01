from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    # Render CBG main page
    return render_template("index.html")

@app.route('/send-score', methods=['POST'])
def send_score():
    # Parse score data from form
    game = request.form["game"]
    score = request.form["score"]
    name = request.form["name"]
    print("Recieved score input")
    
    # Update the SQL DB
    update_db(game, score, name)

    # Return response to site
    response = f"Game: {game}, Score: {score}, Name: {name}"
    print(response)
    return response

def update_db(game, score, name):
    # Connect to the db
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()

    # Create query for new entry
    sql_query = f"INSERT INTO scores (game, score, name) VALUES ('{game}', {score}, '{name}')"
    print("Query: " + sql_query)

    # Execute query
    cursor.execute(sql_query)

    # Commit and close DB
    conn.commit()
    conn.close()

@app.route('/get-scores/<game>', methods=['GET'])
def get_scores(game):
    # Create arrays to hold top scores and names
    scores = [0] * 3
    names = ["---"] * 3
    
    # Connect to the scores db
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()

    # Create and execute query for scores in descending order
    sql_query = f"SELECT * FROM scores WHERE game='{game}' ORDER BY score DESC"
    cursor_rows = cursor.execute(sql_query)

    static_rows =[]
    # TODO: Limit to max 3
    for row in cursor_rows:
        print(row)
        static_rows.append(row)

    # Extract data for top 3 scores
    rows_length = len(static_rows)
    for i in range(3):
        if rows_length <= i:
            break
        
        print(static_rows[i])
        scores[i] = static_rows[i][1]
        names[i] = static_rows[i][2]
    
    # Assemble HTML table
    table_header = "<tr> <th id='col1'></th> <th id='col2'>Score</th> <th>Name</th> </tr>"
    row_1 = f"<tr> <td><b>1</b></td> <td>{scores[0]}</td> <td>{names[0]}</td> </tr>"
    row_2 = f"<tr> <td><b>2</b></td> <td>{scores[1]}</td> <td>{names[1]}</td> </tr>"
    row_3 = f"<tr> <td><b>3</b></td> <td>{scores[2]}</td> <td>{names[2]}</td> </tr>"

    score_table = table_header + row_1 + row_2 + row_3
    return score_table


if __name__ == '__main__':
    app.run(debug=True)
