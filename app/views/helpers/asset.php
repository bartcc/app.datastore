<?php
/**
 * asset_helper.php - For including JS/CSS files that use the AssetPackager
 * shell script
 *
 * Copyright (c) 2007 Bradleyboy Productions LLC (bradleyboy.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @package AssetPackager for CakePHP
 * @author Brad Daily <brad@bradleyboy.com>
 * @copyright 2007 Bradleyboy Productions LLC (bradleyboy.com)
 * @license http://opensource.org/licenses/mit-license.php MIT License
 * @version 0.1.2 (2007-07-30)
 * @link http://blog.bradleyboy.com/2007/07/28/assetpackager-for-cakephp/
 * @link http://bakery.cakephp.org/articles/view/assetpackager-for-cakephp/
 *
 * A centralized CHANGELOG can be found in the asset_packager.php shell script
 * (VENDORS/shells/asset_packager.php)
 *
 */

class AssetHelper extends Helper {
	var $helpers = array('Html');
	
	function js($key) {
		$out = '';
		$file = glob(JS . $key . '_*.js');
		$out .= $this->Html->Script(basename($file[count($file)-1]));
		return $out;
	}

	function css($key) {
		//return;
		$out = '';
		$file = glob(CSS . $key . '_*.css');
		$out .= $this->Html->Css(r('.css', '', basename($file[count($file)-1])));
		return $out;
	}
	
}

?>