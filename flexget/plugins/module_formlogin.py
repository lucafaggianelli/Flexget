import logging
from flexget.feed import Entry
from flexget.plugin import *
import urllib2

log = logging.getLogger('formlogin')


class FormLogin(object):
    """
    Login on form
    """

    def validator(self):
        from flexget import validator
        root = validator.factory('dict')
        root.accept('url', key='url', required=True)
        root.accept('text', key='username', required=True)
        root.accept('text', key='password', required=True)
        root.accept('text', key='userfield') 
        root.accept('text', key='passfield')
        return root

    def on_feed_start(self, feed):
        try:
            from mechanize import Browser
        except ImportError:
            raise PluginError('mechanize required (python module), please install it.', log)

        config = feed.config['form']
        
        userfield = config.get('userfield', 'username')
        passfield = config.get('passfield', 'password')

        url = config['url']
        username = config['username']
        password = config['password']

        br = Browser()
        br.set_handle_robots(False)
        try:
            br.open(url)
        except Exception, e:
            # TODO: improve error handling
            raise PluginError('Unable to post login form', log)

        #br.set_debug_redirects(True)
        #br.set_debug_responses(True)
        #br.set_debug_http(True)

        for form in br.forms():
            loginform = form

            try:
                loginform[userfield] = username
                loginform[passfield] = password
                break
            except Exception, e:
                raise PluginError('Unable to find login fields', log)

        br.form = loginform

        br.submit()

        cookiejar = br._ua_handlers["_cookies"].cookiejar

        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookiejar))
        urllib2.install_opener(opener)                                

    def on_feed_exit(self, feed):
        """Feed exiting, remove cookiejar"""
        log.debug('Removing urllib2 opener')
        urllib2.install_opener(None)

    # Feed aborted, unhook the cookiejar
    on_feed_abort = on_feed_exit                                    

register_plugin(FormLogin, 'form')
