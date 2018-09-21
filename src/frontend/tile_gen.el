;; functions to generate tiles using an emacs buffer as a graphical
;; tile generation tool

(defvar pe-pacman--num-tiles-x nil)
(defvar pe-pacman--num-tiles-y nil)
(defvar pe-pacman--num-tiles nil)
(defvar pe-pacman--current-tile nil)
(defvar pe-pacman--previous-tile nil)
(defvar pe-pacman--tile-alist nil)
(defvar pe-pacman--build-mode nil)
(defvar pe-pacman--drag-link nil)
(defvar pe-pacman--last-move nil)

;; if you don't use emacs, tough luck!
(defun pe-pacman--setup-tile-creator (num-tiles-x num-tiles-y)
  ;; setup and clear buffer
  (switch-to-buffer (get-buffer-create "pe-pacman--tile-creator"))
  (kill-region (point-min) (point-max))

  ;; define variables
  (setq pe-pacman--num-tiles-x num-tiles-x)
  (setq pe-pacman--num-tiles-y num-tiles-y)
  (setq pe-pacman--num-tiles (* num-tiles-x num-tiles-y))
  (setq pe-pacman--previous-tile nil)
  (setq pe-pacman--last-move nil)
  (setq pe-pacman--current-tile 0)
  (setq pe-pacman--build-mode 'type)

  ;; draw board
  (beginning-of-buffer)
  (dotimes (i (+ pe-pacman--num-tiles-x 2)) (insert "#"))
  (newline)
  (dotimes (i pe-pacman--num-tiles-y)
    (insert "#")
    (dotimes (j pe-pacman--num-tiles-x) (insert " "))
    (insert "#")
    (newline)
    )
  (dotimes (i (+ pe-pacman--num-tiles-x 2)) (insert "#"))
  (beginning-of-buffer)
  (forward-line)
  (forward-char)

  ;; set up tile alist
  (setq pe-pacman--tile-alist nil)
  (dotimes (i pe-pacman--num-tiles)
    (setq pe-pacman--tile-alist
          (append pe-pacman--tile-alist (list (copy-alist
                                               '((type . empty)
                                                 (up . nil)
                                                 (down . nil)
                                                 (left . nil)
                                                 (right . nil))))
                  )
          )
    )

  (pe-pacman--builder-keymap)
  )

(defun pe-pacman--builder-keymap ()
  (let ((pe-pacman--keymap (make-sparse-keymap)))
    (define-key pe-pacman--keymap (kbd "w") 'pe-pacman--move-up)
    (define-key pe-pacman--keymap (kbd "s") 'pe-pacman--move-down)
    (define-key pe-pacman--keymap (kbd "a") 'pe-pacman--move-left)
    (define-key pe-pacman--keymap (kbd "d") 'pe-pacman--move-right)
    (define-key pe-pacman--keymap (kbd "SPC") 'pe-pacman--switch-mode)
    (define-key pe-pacman--keymap (kbd "RET") 'pe-pacman--build-action)
    (set-transient-map pe-pacman--keymap t 'pe-pacman--finish-tiles)
    )
  )

(defun pe-pacman--finish-tiles ()
  (interactive)
  (message "finishing")
  (let ((node-index-map nil)
        (index-counter 0))
    (dotimes (i pe-pacman--num-tiles)
      (let ((tile-alist (nth i pe-pacman--tile-alist)))
        (when (or (cdr (assoc 'up tile-alist))
                 (or (cdr (assoc 'down tile-alist))
                      (or (cdr (assoc 'left tile-alist))
                           (cdr (assoc 'right tile-alist))
                           )
                      )
                 )
          (progn
            (add-to-list 'node-index-map (copy-tree (cons i index-counter)))
            (setq index-counter (+ index-counter 1))
            )
          )
        )
      )
    (let ((code ""))
      (dolist (elt node-index-map nil)
        (let ((tile-alist (nth (car elt) pe-pacman--tile-alist))
              (new-code ""))
          (setq new-code (concat new-code "tiles.push(new Dot("
                             (number-to-string (cdr elt))
                             ", "
                             (number-to-string (car elt))
                             ", "))
          (if (eq (cdr (assoc 'type tile-alist)) 'empty)
              (setq new-code (concat new-code "0, "))
            (if (eq (cdr (assoc 'type tile-alist)) 'small)
                (setq new-code (concat new-code "1, "))
              (setq new-code (concat new-code "2, "))
              )
            )

          (if (cdr (assoc 'up tile-alist))
              (setq new-code (concat
                          new-code
                          (number-to-string (cdr (assoc 'up tile-alist)))
                          ", "))
            (setq new-code (concat new-code "-1, "))
            )
          (if (cdr (assoc 'down tile-alist))
              (setq new-code (concat
                          new-code
                          (number-to-string (cdr (assoc 'down tile-alist)))
                          ", "))
            (setq new-code (concat new-code "-1, "))
            )
          (if (cdr (assoc 'left tile-alist))
              (setq new-code (concat
                          new-code
                          (number-to-string (cdr (assoc 'left tile-alist)))
                          ", "))
            (setq new-code (concat new-code "-1, "))
            )
          (if (cdr (assoc 'right tile-alist))
              (setq new-code (concat
                          new-code
                          (number-to-string (cdr (assoc 'right tile-alist)))
                          "));\n"))
            (setq new-code (concat new-code "-1));\n"))
            )
          (setq code (concat new-code code))
          )
        )
      (message code)
      (kill-new code)
      )
    )
  )

(defun pe-pacman--switch-mode ()
  (interactive)
  (if (eq pe-pacman--build-mode 'type)
      (progn
        (setq pe-pacman--build-mode 'link)
        (pe-pacman--draw-links)
        )
    (progn
      (setq pe-pacman--build-mode 'type)
      (pe-pacman--draw-types)
      )
    )
  (message (concat "Building mode: " (symbol-name pe-pacman--build-mode)))
  )

(defun pe-pacman--draw-links ()
  (beginning-of-buffer)
  (forward-line)
  (forward-char)
  (dotimes (i pe-pacman--num-tiles)
    (pe-pacman--draw-link (nth i pe-pacman--tile-alist))
    (forward-char)
    (unless (< (+ (pe-pacman--tile-to-x i) 1)
               pe-pacman--num-tiles-x)
      (forward-line)
      (forward-char)
      )
    )
  (beginning-of-buffer)
  (forward-line (+ (pe-pacman--tile-to-y pe-pacman--current-tile) 1))
  (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
  )

(defun pe-pacman--draw-types ()
  (beginning-of-buffer)
  (forward-line)
  (forward-char)
  (dotimes (i pe-pacman--num-tiles)
      (delete-char 1)
      (let ((tile-type (cdr (assoc 'type
                                   (nth i
                                        pe-pacman--tile-alist)))))
        (if (eq tile-type 'small)
            (insert "+")
          (if (eq tile-type 'large)
              (insert "O")
            (insert " "))
          )
        )
      (unless (< (+ (pe-pacman--tile-to-x i) 1)
                 pe-pacman--num-tiles-x)
        (forward-line)
        (forward-char)
        )
    )
  (beginning-of-buffer)
  (forward-line (+ (pe-pacman--tile-to-y pe-pacman--current-tile) 1))
  (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
  )


(defun pe-pacman--type-action ()
  (message (concat "Changing tile " (number-to-string pe-pacman--current-tile)))
  (let ((tile-type (cdr (assoc 'type
                               (nth pe-pacman--current-tile
                                    pe-pacman--tile-alist)))))
    (if (eq tile-type 'empty)
        (progn
          (setcdr (assoc 'type (nth pe-pacman--current-tile
                                    pe-pacman--tile-alist))
                  'small)
          (delete-char 1)
          (insert "+")
          (backward-char)
          )
      (if (eq tile-type 'small)
          (progn
            (setcdr (assoc 'type (nth pe-pacman--current-tile
                                      pe-pacman--tile-alist))
                    'large)
            (delete-char 1)
            (insert "O")
            (backward-char)
            )
        (progn
          (setcdr (assoc 'type (nth pe-pacman--current-tile
                                    pe-pacman--tile-alist))
                  'empty)
          (delete-char 1)
          (insert " ")
          (backward-char)
          )
        )
      )
    )
  )

(defun pe-pacman--update-link (start dest move)
  (if (eq (cdr (assoc move (nth start pe-pacman--tile-alist))) dest)
      (setcdr (assoc move (nth start pe-pacman--tile-alist)) nil)
    (setcdr (assoc move (nth start pe-pacman--tile-alist)) dest)
    )
  )

(defun pe-pacman--draw-link (tile-alist)
  (let ((link-chars '(" " "\u257A" "\u2578" "\u2501" "\u257B" "\u250F"
                      "\u2513" "\u2533" "\u2579" "\u2517" "\u251B"
                      "\u253B" "\u2503" "\u2523" "\u252B" "\u254B"))
        (index 0))
    (when (cdr (assoc 'right tile-alist))
      (setq-local index (logior index 1))
      )
    (when (cdr (assoc 'left tile-alist))
      (setq-local index (logior index 2))
      )
    (when (cdr (assoc 'down tile-alist))
      (setq-local index (logior index 4))
      )
    (when (cdr (assoc 'up tile-alist))
      (setq-local index (logior index 8))
      )
    (delete-char 1)
    (insert (nth index link-chars))
    (backward-char)
    )
  )

(defun pe-pacman--link-action ()
  (when pe-pacman--previous-tile
    (if (eq pe-pacman--last-move 'up)
        (progn
          (pe-pacman--update-link pe-pacman--previous-tile
                                  pe-pacman--current-tile
                                  'up)
          (pe-pacman--update-link pe-pacman--current-tile
                                  pe-pacman--previous-tile
                                  'down)
          (message (concat "link: "
                           (number-to-string pe-pacman--previous-tile)
                           " up to "
                           (number-to-string pe-pacman--current-tile)))
          )
      (if (eq pe-pacman--last-move 'down)
          (progn
            (pe-pacman--update-link pe-pacman--previous-tile
                                    pe-pacman--current-tile
                                    'down)
            (pe-pacman--update-link pe-pacman--current-tile
                                    pe-pacman--previous-tile
                                    'up)
            (message (concat "link: "
                             (number-to-string pe-pacman--previous-tile)
                             " down to "
                             (number-to-string pe-pacman--current-tile)))
            )
        (if (eq pe-pacman--last-move 'left)
            (progn
              (pe-pacman--update-link pe-pacman--previous-tile
                                      pe-pacman--current-tile
                                      'left)
              (pe-pacman--update-link pe-pacman--current-tile
                                      pe-pacman--previous-tile
                                      'right)
              (message (concat "link: "
                               (number-to-string pe-pacman--previous-tile)
                               " left to "
                               (number-to-string pe-pacman--current-tile)))
              )
          (progn
            (pe-pacman--update-link pe-pacman--previous-tile
                                    pe-pacman--current-tile
                                    'right)
            (pe-pacman--update-link pe-pacman--current-tile
                                    pe-pacman--previous-tile
                                    'left)
            (message (concat "link: "
                             (number-to-string pe-pacman--previous-tile)
                             " right to "
                             (number-to-string pe-pacman--current-tile)))
            )
          )
        )
      )
    )

  (beginning-of-buffer)
  (forward-line (+ (pe-pacman--tile-to-y pe-pacman--previous-tile) 1))
  (forward-char (+ (pe-pacman--tile-to-x pe-pacman--previous-tile) 1))
  (pe-pacman--draw-link (nth pe-pacman--previous-tile
                             pe-pacman--tile-alist))

  (beginning-of-buffer)
  (forward-line (+ (pe-pacman--tile-to-y pe-pacman--current-tile) 1))
  (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
  (pe-pacman--draw-link (nth pe-pacman--current-tile
                             pe-pacman--tile-alist))
  )

(defun pe-pacman--build-action ()
  (interactive)
  (if (eq pe-pacman--build-mode 'type)
      (pe-pacman--type-action)
    (pe-pacman--link-action)
    )
  )

(defun pe-pacman--refresh-current-tile ()
  (setq pe-pacman--previous-tile pe-pacman--current-tile)
  (setq pe-pacman--current-tile
        (+ (* (- (line-number-at-pos) 2) pe-pacman--num-tiles-x)
           (- (current-column) 1)))
  (message (concat "Tile: " (number-to-string pe-pacman--current-tile)
                   " ("
                   (number-to-string
                    (pe-pacman--tile-to-x pe-pacman--current-tile))
                   ", "
                   (number-to-string
                    (pe-pacman--tile-to-y pe-pacman--current-tile))
                   ")"
                   )
           )
  )

(defun pe-pacman--move-up ()
  (interactive)
  (if (> (line-number-at-pos) 2)
      (progn
        (forward-line -1)
        (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
        )
    (forward-line (- pe-pacman--num-tiles-y 1))
    (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
    )
  (setq pe-pacman--last-move 'up)
  (pe-pacman--refresh-current-tile)
  )

(defun pe-pacman--move-down ()
  (interactive)
  (if (< (line-number-at-pos) (+ pe-pacman--num-tiles-y 1))
      (progn
        (forward-line)
        (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
        )
    (forward-line (- 1 pe-pacman--num-tiles-y))
    (forward-char (+ (pe-pacman--tile-to-x pe-pacman--current-tile) 1))
    )
  (setq pe-pacman--last-move 'down)
  (pe-pacman--refresh-current-tile)
  )

(defun pe-pacman--move-left ()
  (interactive)
  (if (> (current-column) 1)
      (backward-char)
    (forward-char (- pe-pacman--num-tiles-x 1))
    )
  (setq pe-pacman--last-move 'left)
  (pe-pacman--refresh-current-tile)
  )

(defun pe-pacman--move-right ()
  (interactive)
  (if (< (current-column) pe-pacman--num-tiles-x)
      (forward-char)
    (backward-char (- pe-pacman--num-tiles-x 1))
    )
  (setq pe-pacman--last-move 'right)
  (pe-pacman--refresh-current-tile)
  )

(defun pe-pacman--tile-to-x (tile)
  (% tile pe-pacman--num-tiles-x)
  )

(defun pe-pacman--tile-to-y (tile)
  (floor (/ tile pe-pacman--num-tiles-x))
  )

(pe-pacman--setup-tile-creator 28 36)
