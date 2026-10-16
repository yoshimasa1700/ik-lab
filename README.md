# IK Lab — 触ってわかる逆運動学

日本語のインタラクティブな平面2リンクアーム教材。

**デモ: https://yoshimasa1700.github.io/ik-lab/**

## できること

- 手先目標をドラッグ、スライダー、矢印キーで操作（Shiftで微調整）
- IK（位置→角度）とFK（角度→位置）の切り替え
- 肘角の正負による2つの解の比較と重ね合わせ
- リンク長の変更、環状の到達範囲の表示
- 到達不能な目標と最近接の到達位置・誤差の可視化
- 特異点・等長リンクの原点での無限解の説明
- 数式と現在の値を対応させた学習

## ローカル実行

Python 3で静的サーバーを起動します。外部パッケージのインストールは不要です。

```sh
python3 -m http.server 4173
```

http://localhost:4173 を開きます。ES Modulesを使うため、ファイルを直接開くのではなくHTTP経由で利用してください。

## テスト

Node.js 20以降で `npm test`。全象限の目標について両分岐を順運動学で検証し、内外の到達不能、等長リンクの原点、伸長特異点も確認します。

## モデル

角度は反時計回り正。肩角θ₁はx軸基準、肘角θ₂は第1リンクに対する相対角。長さの単位は任意です。内部計算はラジアン、画面は度表示。到達不能な場合は半径を到達範囲へ射影します。等長リンクかつ原点のIKでは肩0°を代表解とします。

位置のみの平面2自由度教材であり、関節制限、障害物、動力学、手先姿勢の指定、経路計画は実装していません。

## 構成

- `index.html` — 日本語の教材とSVG
- `style.css` — レスポンシブな実験ノート風UI
- `app.js` — 操作・描画・状態説明
- `kinematics.js` — 純粋なFK/IK関数
- `tests/kinematics.test.js` — 数値検証

ビルド不要、外部フォント・CDN・分析ツールなし。GitHub Pagesではmainブランチのルートを公開します。

## 参考

- [CMU — Two Link Kinematics](https://courses.ideate.cmu.edu/16-375/f2022/ref/text/reference/two-link-kinematics.html)
- [MathWorks — Derive and Apply Inverse Kinematics to Two-Link Robot Arm](https://www.mathworks.com/help/symbolic/derive-and-apply-inverse-kinematics-to-robot-arm.html)
