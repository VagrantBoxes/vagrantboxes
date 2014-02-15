<?php

// This script doesn't auto-detect puppet correctly because we look
// for the pattern 'puppet' which obviously matches puppetlabs also
// and some people use 'no puppet' in the box name as well.

$rows = csv_to_array('data.csv', '#');

$distros = json_decode(file_get_contents('_distributions.json'));

$boxes = array();

foreach ($rows as $row) {

    $name = $row['Name'];

    $box = new Box(
        $name,
        str_replace(
            array('Virtualbox', 'VMWare'),
            array('VirtualBox', 'VMware'),
            $row['Provider']
        ),
        $row['Url'],
        $row['Size']
    );

    if (is_32_bit($name) ) {
        $box->architecture = '32-bit';
    } else if (is_64_bit($name) ) {
        $box->architecture = '64-bit';
    } else {
        $box->architecture = 'Unknown';
    }

    $distro_detected = false;
    $distro_name = '';
    $distro_slug = '';

    // detect the distribution and sort them somehow
    foreach ($distros as $distro) {
        $distro_name = $distro->name;
        $distro_slug = $distro->slug;

        $pos_1 = strpos(
            strtolower($box->name),
            strtolower(trim($distro->name))
        );

        $pos_2 = strpos(
            strtolower($box->name),
            strtolower(trim($distro->slug))
        );

        if (is_int($pos_1) || is_int($pos_2)) {
            $distro_detected = true;
            break;
        }
    }

    if ($distro_detected) {
        if (! array_key_exists($distro_slug, $boxes))
            $boxes[$distro_slug] = array();

        $boxes[$distro_slug][] = $box;
    } else {
        if (! array_key_exists('others', $boxes))
            $boxes['others'] = array();

        $boxes['others'][] = $box;
    }
}

foreach ($boxes as $distro => $list) {
    file_put_contents("boxes/$distro.json", json_encode($list, JSON_PRETTY_PRINT));
}

######################################################################
# HELPERS

function is_64_bit($name)
{
    $archs = array(
        'amd64',
        'x86_64',
        'x64',
        '64-bit',
        '64bit',
        ' 64 ',
        ' 64,',
        ',64 ',
    );

    return is_arch_detected($archs, $name);
}

function is_32_bit($name)
{
    $archs = array(
        'x86',
        'i386',
        '32-bit',
        '32bit',
        ' 32 ',
        ' 32,',
        ',32',
    );

    return is_arch_detected($archs, $name);
}

function is_arch_detected($archs, $name)
{
    foreach ($archs as $arch) {

        $pos = strpos(
            strtolower($name),
            strtolower($arch)
        );

        if (is_int($pos)) {
            return true;
        }
    }

    return false;
}

// borrowed from php.net, just google for it
function csv_to_array($filename='', $delimiter=',')
{
    if(!file_exists($filename) || !is_readable($filename))
        return FALSE;

    $header = NULL;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== FALSE)
    {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
        {
            if(!$header)
                $header = $row;
            else
                $data[] = array_combine($header, $row);
        }
        fclose($handle);
    }
    return $data;
}

// huh, i'm yet sleeping, decoding a json template would have been much
// faster
class Box
{
    public $name = '';
    public $version = null;
    public $architecture = '';
    public $provider = '';
    public $size = '';
    public $url = '';
    public $source = '';
    public $comment = '';
    public $creator = '';
    public $created = '';

    function __construct($name, $provider, $url, $size)
    {
        $this->name = trim($name);
        $this->provider = trim($provider);
        $this->url = trim($url);
        $this->size = (int) $size;

        $this->init_features($name);
        $this->init_hash();
        $this->init_version();
    }

    private function init_version() {
        $this->version = (object) array(
            'name' => '',
            'number' => ''
        );
    }

    private function init_hash() {
        $this->hash = (object) array(
            'md5sum' => '',
            'sha1sum' => '',
            'sha256sum' => '',
            'sha384sum' => '',
            'sha512sum' => '',
        );
    }

    private function init_features($name) {
        $this->features = (object) array(
            'guest_additions' => false,
            'vmware_tools' => false,
            'puppet' => is_int(strpos(
                strtolower($name),
                'puppet'
            )),
            'chef' => is_int(strpos(
                strtolower($name),
                'chef'
            )),
            'webserver' => (object) array(
                'apache' => false,
                'lighttpd' => false,
                'nginx' => false
            ),
            'interpreters' => (object) array(
                'ruby' => false,
                'php' => false,
                'python' => false
            ),
            'database' => (object) array(
                'mysql' => false,
                'mongodb' => false
            ),
            'vcs' => (object) array(
                'git' => false,
                'svn' => false,
                'hg' => false
            ),
        );
    }
}