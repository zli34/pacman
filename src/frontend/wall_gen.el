;; functions to generate wall sprites with the arrow keys
;; if you don't use emacs, tough luck!

(defvar pe-pacman--width 28)
(defvar pe-pacman--height 36)
(defvar pe-pacman--build-direction nil)
(defvar pe-pacman--current-square nil)
(defvar pe-pacman--num-squares nil)

(defun pe-pacman--init-wall-class (init-square-x init-square-y)
  (interactive)
  (indent-for-tab-command)
  (insert (concat "// "
                  (number-to-string init-square-x)
                  ", "
                  (number-to-string init-square-y)))
  (newline-and-indent)
  (insert "walls.push(new Wall([")
  (move-end-of-line nil)
  (newline-and-indent)
  (insert (number-to-string pe-pacman--current-square))
  (setq pe-pacman--num-squares (+ 1 pe-pacman--num-squares))
  )

(defun pe-pacman--finish-wall-class ()
  (interactive)
  (newline-and-indent)
  (insert "], true));")
  )

(defun pe-pacman--build-up ()
  (interactive)
  (setq pe-pacman--current-square
        (- pe-pacman--current-square pe-pacman--width))
  (insert ", ")
  (insert (number-to-string pe-pacman--current-square))
  (setq pe-pacman--num-squares (+ 1 pe-pacman--num-squares))
  )

(defun pe-pacman--build-down ()
  (interactive)
  (setq pe-pacman--current-square
        (+ pe-pacman--current-square pe-pacman--width))
  (insert ", ")
  (insert (number-to-string pe-pacman--current-square))
  (setq pe-pacman--num-squares (+ 1 pe-pacman--num-squares))
  )

(defun pe-pacman--build-left ()
  (interactive)
  (setq pe-pacman--current-square
        (- pe-pacman--current-square 1))
  (insert ", ")
  (insert (number-to-string pe-pacman--current-square))
  (setq pe-pacman--num-squares (+ 1 pe-pacman--num-squares))
  )

(defun pe-pacman--build-right ()
  (interactive)
  (setq pe-pacman--current-square
        (+ pe-pacman--current-square 1))
  (insert ", ")
  (insert (number-to-string pe-pacman--current-square))
  (setq pe-pacman--num-squares (+ 1 pe-pacman--num-squares))
  )


(defun pe-pacman--builder-keymap ()
  (let ((pe-pacman--keymap (make-sparse-keymap)))
    (define-key pe-pacman--keymap (kbd "w") 'pe-pacman--build-up)
    (define-key pe-pacman--keymap (kbd "s") 'pe-pacman--build-down)
    (define-key pe-pacman--keymap (kbd "a") 'pe-pacman--build-left)
    (define-key pe-pacman--keymap (kbd "d") 'pe-pacman--build-right)
    (set-transient-map pe-pacman--keymap t 'pe-pacman--finish-wall-class)
    )
  )

(defun pe-pacman--create-wall ()
  (interactive)
  (message "create wall")
  (setq pe-pacman--num-squares 0)
  (let ((init-coords
         (split-string
          (read-from-minibuffer "Enter coordinates: "))))
    (setq pe-pacman--current-square
          (+ (string-to-number (nth 0 init-coords))
             (* (string-to-number (nth 1 init-coords))
                pe-pacman--width)
             )
          )

    (pe-pacman--init-wall-class (string-to-number (nth 0 init-coords))
                                (string-to-number (nth 1 init-coords)))
    )
  (pe-pacman--builder-keymap)
  )
