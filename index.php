    <!-- Simple index.html to show site map -->
    <!DOCTYPE html>
    <html lang="ja">
     <head>
     <meta charset="utf-8">
     <title>Simple Chat</title>
     <meta name="description" content="input description here ">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel=”shortcut icon” href=“favicon.ico”>
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"> 
     </head>
     <body>

    <!-- Navigation bar -->
    <!-- Ref : https://bulma.io/documentation/components/navbar/ -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a href="../index.php">
              <h3 class="is-3 mr-5" style = "display: flex; align-items: center;">
              <img src="./agent2/media/pageicon.svg" width="60" height="60">
              <p class="is-size-3 has-text-black">Simple Chat</p>
              </h3>
          </a>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="simplenavbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </nav>

    <!-- title -->
     <div class="columns is-centered mb-5 mt-5">
        <div class="column is-9 has-text-centered">
            <h1 class="title is-2"><?php echo dirname(__FILE__) ?></h1>
        </div>
    </div>

    <!-- site map -->
    <div class="columns is-centered mb-5 mt-5">
        <div class="column is-4">
        <aside class="menu">
            <ul class="menu-list">
            <li>
                <a class="is-active">Chat agents</a>
                <ul>
                <?php
                    $path = dirname( __FILE__);
                    $dirs = scandir($path);

                    // dirs to ignore
                    $excludes = array(
                        '.',
                        '..',
                        '.git',
                    );

                    foreach ($dirs AS $dir) {
                        // exception
                        if (in_array($dir, $excludes)) {
                            continue;
                        }
                        // check if each dir is a chat agent.
                        if ((is_dir($dir) === true) && (is_file($dir . "/chat.js") === true)) {
                            echo '<li>';
                            echo '<a href="./' . $dir . '" target="_blank" rel="noopener noreferrer">';
                            echo "./" . $dir;
                            echo '</a></li>'."\n";
                        }
                    }
                ?>
                </ul>
            </li>
            </ul>

            <ul class="menu-list mt-5">
                <li>
                <a class="is-active">For debug</a>
                <ul>
                    <?php
                        // list php files
                        $phpscripts = glob('./*.php');
                        foreach ($phpscripts AS $phpscript) {
                            echo '<li>';
                            echo '<a href="./' . $phpscript . '" target="_blank" rel="noopener noreferrer">';
                            echo $phpscript;
                            echo '</a></li>'."\n";
                        }
                    ?>
                </ul>
                </li>
            </ul>
        </aside>
        </div>
      </div>

     </body>
    </html>